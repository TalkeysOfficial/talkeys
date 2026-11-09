# Talkeys architecture and state machines

This document maps how the system behaves today, including known defects.
It is the reference for the restructure: every transition listed here is
pinned by a characterization test under `Server/test/characterization/`.
Line numbers refer to commit `62e7668` and will drift; symbol names are stable.

## System context

```
Browser ── Client/ (Next.js 14, Vercel) ──HTTP + Bearer JWT──▶ Server/ (Express 4, Docker on VM) ──▶ MongoDB Atlas
                                                                    ├──▶ PhonePe Checkout v2 (orders, status, webhook)
                                                                    ├──▶ Google OAuth (ID token verification at login)
                                                                    └──▶ Cloudinary (event images)
```

- Auth is stateless: `POST /verify` exchanges a Google ID token for a JWT signed with `SECRET`
  (`Server/src/controllers/authentication.js` `login`). `verifyToken`
  (`Server/src/middleware/oauth.js`) re-reads the user by the token's `email` on every request.
- Server bootstrap: `Server/src/app.js` builds the Express app; `Server/src/server.js` connects Mongo and listens.
  Global middleware order: `express.json` → `urlencoded` → static `/uploads` → morgan (stdout and
  `Server/log/access.log`) → `cookieParser` → `cors()` (any origin) → force JSON content type →
  router → `express-custom-error` handler → 404 JSON.

## Route table

Middleware is positional in `Server/src/routes/router.js`: every route after
`router.use(auth.verifyToken)` needs a JWT, and every route after
`router.use(checkRole(["admin"]))` also needs `role: "admin"`.

| Access | Method and path | Handler |
|---|---|---|
| public | GET `/api/payment/callback/:merchantOrderId` | `Passes.handlePaymentCallback` |
| public | POST `/api/payment/webhook`, POST `/payment/webhook` | `Passes.handlePaymentWebhook` |
| public | GET `/api/ticket-status/:passId` | `Passes.getTicketStatus` |
| public | GET `/getEvents`, GET `/getEventById/:id` | `Events.getEvents`, `Events.getEventById` |
| public | POST `/verify`, GET `/logout` | `authentication.login`, `authentication.logout` |
| JWT | `/dashboard/profile` (GET, PATCH), GET `/dashboard/events`, GET `/dashboard/activity` | `dashboard.controller` |
| JWT + organizer | `/dashboard/create-event`, `/edit-event/:id`, `/participants/:id`, `/approve-participant/:id`, `/export-participants/:id`, `/event-analytics/:id` | `dashboard.controller` |
| JWT | POST `/register` | `Events.registerForInfluencer` |
| JWT | POST `/createTeam`, POST `/joinTeam` | `Teams.createTeam`, `Teams.joinTeam` |
| JWT | POST `/api/book-ticket`, POST `/bookPass` | `Passes.bookTicket` |
| JWT | GET `/api/passbyuuid/:passUUID`, POST `/api/getTix`, POST `/getPass` | pass lookups |
| JWT | GET `/likeEvent/:id`, `/unlikeEvent/:id`, `/getAllLikedEvents` | likes |
| JWT | POST `/reqEvent` | `Events.reqEventt` |
| JWT | POST `/accept`, POST `/Accept` | `Passes.Accept` (check-in scan) |
| JWT + admin | GET `/CanScan`, GET `/regisDetails` | scanner capability, registrations |
| JWT + admin | `/admin/events` (GET, POST), `/admin/events/:eventId` (GET, PUT), `/admin/events/:eventId/stats`, POST `/admin/event-images`, POST `/addEvent`, DELETE `/deleteSpecificEvent/:eventId` | event management |

The dashboard router is mounted before the global `verifyToken`, but applies its own.

Exported but not routed: `cleanupExpiredPasses` (`passes.controller.js`).
Dead code (contact, registration, websocket, team verification, email service and templates, four unrouted pass handlers, the unused `Registration` model) was removed in Phase 4a; see git history before that commit.

## 1. Pass lifecycle (core)

A `Pass` (`Server/src/models/passes.model.js`) carries three overlapping status fields that always move together:

| Field | Enum | Default |
|---|---|---|
| `status` | pending, active, payment_failed, expired, revoked | pending |
| `passStatus` | active, inactive, expired, revoked | inactive |
| `paymentStatus` | completed, pending, failed, refunded | pending |

Composite states as written by code (`status / passStatus / paymentStatus`):

```mermaid
stateDiagram-v2
    [*] --> Pending: bookTicket (paid event)
    [*] --> Active: bookTicket (free or zero amount)
    Pending --> PaymentFailed: PhonePe order creation fails
    Pending --> Active: webhook completed / status check COMPLETED
    Pending --> PaymentFailed: webhook failed / status check FAILED
    Pending --> Expired: cleanupExpiredPasses (never scheduled)
    PaymentFailed --> Active: late COMPLETED confirmation
    Expired --> Active: late COMPLETED confirmation
    Pending --> Approved: organizer approveParticipant
    Active --> Active: Accept scans one QR
    Active --> CheckedIn: Accept scans the last QR
```

| From | To | Trigger | Guard | Side effects | Code |
|---|---|---|---|---|---|
| none | Pending `pending/inactive/pending` | `bookTicket`, paid event and amount > 0 | JWT, valid event, team membership, basic-pass rule, inventory | reserves seats, creates PhonePe order, `expiresAt = now + 20 min` | `passes.controller.js` `bookTicket` |
| none | Active `active/active/completed` | `bookTicket`, free or amount 0 | same | reserves seats, `qrStrings` built, `passUUID` set by pre-save | `bookTicket` |
| Pending | PaymentFailed `payment_failed/inactive/failed` | PhonePe order creation throws | none | releases seats; HTTP 500 | `bookTicket` inner catch |
| Pending, PaymentFailed, Expired | Active `active/active/completed` | webhook `checkout.order.completed`; status check `COMPLETED` (callback, `getTicketStatus`) | pass found by `merchantOrderId`; re-reserves seats if released | `passUUID`, `qrStrings`, `confirmedAt`, `$inc activePasses` on the user (field is not in the User schema, so it is silently dropped) | `processPaymentConfirmation` |
| Active | Active | repeat confirmation | `paymentStatus === completed` | repairs missing UUID or QR, no double count | `processPaymentConfirmation` |
| any non-completed | PaymentFailed | webhook `checkout.order.failed`; status check `FAILED` | `paymentStatus !== completed` | releases seats | `processPaymentFailure` |
| Pending past `expiresAt` | Expired `expired/expired/failed` | `cleanupExpiredPasses` | none | releases seats | not called anywhere |
| Pending | `active/inactive/pending` | organizer `PUT /dashboard/approve-participant/:id` | event `organizerEmail` matches | pre-save generates `passUUID` and `qrStrings` without payment | `dashboard.controller.js` `approveParticipant` |
| Active | Active / checked in | `POST /accept` with `uuid`, `qrId` | `paymentStatus === completed`; QR exists; not already scanned (409) | `qrStrings[i].qrScanned`, `scannedAt`; `isScanned` and `timeScanned` once all QRs are scanned | `Accept` |

Invariants and defects (pinned by tests, fixed in later phases):

- **Pending passes never expire.** `cleanupExpiredPasses` has no scheduler, so abandoned paid bookings hold seats until a webhook, callback or `getTicketStatus` resolves them.
- **Unauthenticated payment confirmation.** If `PHONEPE_WEBHOOK_USERNAME` or `PHONEPE_WEBHOOK_PASSWORD` is unset, the webhook accepts any body, so anyone can mark any `merchantOrderId` paid. When set, the check compares `SHA256(username:password)`, a static shared secret.
- **No amount check.** Confirmation never compares the PhonePe amount with `pass.amount`.
- **Any logged-in user can check people in.** `/accept` sits before `checkRole(["admin"])`. Scanning also re-activates a `revoked` pass whose payment is completed.
- **`approveParticipant` issues a QR without payment.** That pass cannot be scanned, because `Accept` requires `paymentStatus === completed`.
- **Late confirmation re-reserves `registrationCount` but not pass-type quantities.** Pass-type `soldQuantity` therefore drifts.
- **No duplicate-booking guard.** One user can hold many passes for the same event, and any team member can book the whole team again.
- **Bookings ignore registration state.** `bookTicket` checks neither `isRegistrationOpen`, `isLive`, `status` nor dates. Only pass-type `isActive` is checked (`resolvePassType`).
- **`getTicketStatus` is public** and returns the owner's name, email and phone for any pass id.
- **Only one unpaid pass can exist at a time.** `qrStrings.id` has a unique index that is not sparse (`passes.model.js`), so every unpaid pass (empty `qrStrings`) indexes as `null` and a second one fails with E11000 (HTTP 500). Applies wherever the index is built.
- **Plain-text and HTML responses are labelled `application/json`.** The global content-type middleware sets it for every non-multipart response, including the payment error redirect page and `/logout`.

## 2. Event inventory

Seats are counted twice: event-level `registrationCount` against `totalSeats`, and per pass type
`passTypes[].bookedQuantity` and `soldQuantity` against `maxAvailable`.

| Step | Effect | Code |
|---|---|---|
| reserve | atomic `$inc registrationCount` only if `registrationCount + n <= totalSeats`, else HTTP 400 "Insufficient tickets available" | `reserveSeats`, `reserveBookingInventory` |
| reserve pass types | per selection, atomic `$inc` on an active pass type with capacity; on failure the event-level reservation is rolled back | `reservePassTypeSelections` |
| release | `$inc registrationCount -ticketCount`, release pass types, `seatsReserved = false` | `releaseReservedSeats`, `releasePassTypeSelections` |

The `Event` pre-validate hook (`events.model.js`) synthesises a single "General Pass" from
`ticketPrice` and `totalSeats` when `passTypes` is empty.

## 3. Event visibility and registration

- `status` enum `draft | published | cancelled`, default `published`. No code writes `draft` or `cancelled`.
- `isRegistrationOpen`, `isLive` and `startRegistrationDate` are set by admins and organizers through create and edit.
- `getStatus()` (`events.model.js`) derives a display state: not `isRegistrationOpen` → `registration_closed`; before `startRegistrationDate` → `coming_soon`; `isLive` → `live`; else `ended`.
- `getEvents` returns every event regardless of `status` or `visibility` unless a `visibility` query is passed. `search` goes unescaped into `$regex`. The response `status` field is the derived `getStatus()` value, which overwrites the stored `draft | published | cancelled`.

## 4. Team membership

```mermaid
stateDiagram-v2
    [*] --> Open: createTeam (leader is member 1)
    Open --> Open: joinTeam (members < maxMembers)
    Open --> Full: joinTeam (members reach maxMembers)
    Full --> Full: joinTeam rejected "Team is full"
```

- `createTeam` (`team.controller.js`) requires an `isTeamEvent` event and a user not already in a team for that event. It retries code generation 5 times.
- `joinTeam` is idempotent for existing members (200). It rejects members of another team for the same event and full teams. The capacity check is read-then-write, not atomic.
- Booking a team event requires `teamCode` and membership (`getTeamBooking`). Other members become `friends` on the pass.

## 5. Identity and roles

- `User.role` enum `user | admin | organizer`, default `user` (`users.model.js`). No route changes a role; it is set directly in the database.
- `verifyToken` responses: no token 403, bad token 401, unknown email 404.
- `checkRole` rejects other roles with 403. `canScan` and `admnDetails` re-check `admin` inside the handler. Because `checkRole(["admin"])` guards everything after it, an unknown path returns 403 to non-admins; only admins reach the JSON 404.
- `PATCH /dashboard/profile` only writes `displayName`, `about`, `pronouns` and `avatarUrl`, but its response includes the user's `accessToken` and `refreshToken`.

## 6. Client payment flow

1. Event page → `POST /api/book-ticket` (or `/bookPass`).
2. Free: the Client shows the pass from the response. Paid: the browser goes to the PhonePe `paymentUrl`.
3. PhonePe → `GET /api/payment/callback/:merchantOrderId`. The Server checks the status with PhonePe, applies the transition, then sends a 302 to `FRONTEND_URL/ticket/{success,failure,pending}`. Errors send `/ticket/error`, a page the Client does not have.
4. `/ticket/success` fetches the pass by `passId` and `uuid`. `/ticket/pending` does not poll.

## Other stored state without transitions

- `ContactUs.status` (`pending | responded | spam`): no route writes contact messages.
- `reqEvent`: created by `POST /reqEvent`; never approved or read by any route.
- `InfluencerRegistration`: created by `POST /register`.
