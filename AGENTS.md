# AGENTS.md

Guidance for AI coding agents working in this repository.

## Repo layout

Two independent Node projects in one repo, no shared root package.json/workspace tooling:

- `Client/` — Next.js 15 (App Router) + TypeScript frontend, deployed on Vercel.
- `Server/` — Express + MongoDB (Mongoose) REST API backend, deployed via Docker.

Each has its own `package.json`, `.env`, and `node_modules`. Run commands from inside the respective directory.

## Commands

### Client (`Client/`)
```bash
bun run dev       # start dev server (localhost:3000)
bun run build     # production build
bun run start     # serve production build
bun run lint      # next lint
bun run typecheck # tsc --noEmit
bun run analyze   # build with bundle analyzer (ANALYZE=true)
```
No test suite is configured.

### Server (`Server/`)
```bash
bun run dev       # nodemon src/server.js (auto-reload)
bun run start     # node src/server.js
bun run test      # node --test test/*.test.js test/characterization/*.test.js (in-memory MongoDB, no network)
```
Env vars: copy `Server/.env.example` to `Server/.env` and `Client/.env.example` to `Client/.env`, and fill them in. Never print or commit real values (`*.env` is git-ignored).

### Docker
`Server/Dockerfile` (Bun installs deps, Node 24 runs) and `Client/Dockerfile` (standalone Next build) are used by root `compose.yaml` (prod-shaped: `server` only, host `127.0.0.1:4890` → container `8000`, fronted by nginx on the VM, env from `Server/.env`) and `compose.local.yaml` (adds `mongo` and `client`). Local stack: `docker compose -f compose.yaml -f compose.local.yaml up --build`. Never name a file `compose.override.yaml`: the VM would auto-load it. `.github/workflows/docker.yml` deploys over SSH on push to `main` using the `DEPLOY_*` secrets.

## Conventions

- Bun installs and runs scripts; the runtime is Node 24. Lockfiles are `bun.lock` only, never `package-lock.json`.
- Never run the Server against a real database: use `mongodb://localhost:27017/talkeys_dev` or the in-memory test DB.
- Server tests live in `Server/test/` (`characterization/` pins current behavior, including known quirks). Do not edit a test to make it pass; change it only when the behavior change is intended.
- Before pushing: `bun run test` in `Server/`, and `bun run typecheck && bun run lint && bun run build` in `Client/`. Every push to `main` deploys the Client to Vercel production and the Server to the VM.
- Stage files by explicit path. Commit messages are imperative sentence case (`Remove stray root files`).
- `Server/src/app.js` allows CORS only from talkeys.xyz, www.talkeys.xyz, `FRONTEND_URL` and `CORS_ORIGINS`, and rate-limits per client IP (600/min overall; 60/min on `/verify` and booking). It trusts `X-Forwarded-For` only from private hops.
- State machines and the full route table: `docs/ARCHITECTURE.md`. Project overview and setup: `README.md`. Keep this file the only agent doc (no `CLAUDE.md`).

## Backend architecture (`Server/src`)

Layered Express app, single router file, no framework-level DI:

- `app.js` builds the Express app (CORS, security headers, body and cookie parsing, custom logger in `shared/logger.js` using `rotating-file-stream`, router, error handler). `server.js` connects Mongoose and listens.
- `routes/router.js` — **all routes are registered in this single file**, in a specific, order-sensitive sequence:
  1. Public/unauthenticated routes first (payment callback, `getEvents`, `getEventById`, `/verify` login, `/logout`).
  2. `router.use(auth.verifyToken)` — everything registered *after* this line requires a JWT (`Authorization: Bearer <token>`) verified in `shared/middleware/oauth.js`, which attaches `req.user` from Mongo.
  3. `router.use(checkRole(["admin"]))` — everything after this additionally requires `req.user.role === "admin"` (`shared/middleware/role.middleware.js`).
  - When adding a route, its position relative to these two `router.use()` calls determines its auth level — there's no per-route decorator.
  - `modules/dashboard/dashboard.routes.js` is mounted separately at `/dashboard` and has its own auth requirements.
- `modules/<domain>/` — one folder per domain, each with its controller, Mongoose model(s) and validation: `auth` (Google login, users), `events` (events, event schema, request-an-event, influencer registration), `passes` (payment and scanning in the controller; `booking.service.js` validates bookings and creates passes, `phonepe.service.js` is the PhonePe client, `inventory.service.js` reserves seats and pass types), `teams`, `dashboard` (organizer routes and router), `admin`. Business logic lives in `<domain>.service.js` files (`passes/booking.service.js`, `events/events.service.js`, `passes/phonepe.service.js`); controllers parse the request and shape the response.
- `shared/` — cross-domain code: `middleware/` (`oauth`, `role.middleware`), `cloudinary.js` (image upload), `logger.js`.
- `routes/router.js` registers every route except `/dashboard`. Controllers are imported here only.
- Payments go through PhonePe: `/api/payment/callback/:merchantOrderId` (public, explicitly bypassed in `verifyToken`), `/payment/webhook` (raw body parsing via `express.raw`), and ticket/pass booking routes (`/api/book-ticket`, `/bookPass`, `/api/getTix`, `/api/passbyuuid/:passUUID`).

## Frontend architecture (`Client/src`)

- `app/` — Next.js App Router pages. Notable routes: `dashboard/` (organizer dashboard: bookmarks, hosted, registered, profile, recent-activity), `admin/` (admin-only tools: event creation, QR scanner), `event/[id]/` and `eventPage/` (with an intercepting route `eventPage/(..)event/[id]/` for modal-style event previews), ticket status pages (`ticket/success|pending|failure`).
- `features/<domain>/` — domain code, each with `components/`, `hooks/` and helpers: `auth`, `events`, `booking`, `tickets`, `profile`, `dashboard`, `admin`, `marketing`. Pages in `app/` import from here.
  - `features/auth/authContext.tsx` — global sign-in state via React Context, backed by `accessToken` in `localStorage` (not cookies/session). `useAuth()` hook throws outside the provider.
  - `lib/api.ts` — shared fetch helpers (`apiUrl`, `authHeaders`, `parseJson`, `throwApiError`) used by the typed wrappers in `features/events/eventApi.ts` (likes), `features/tickets/api.ts` (passes) and `features/booking/api.ts` (`bookTicket`); reads `BACKEND_URL` from env and attaches the bearer token from `localStorage` via `authHeaders()`. Follow this pattern (typed function, `authHeaders()`, throw parsed error body on `!res.ok`) when adding new API calls rather than calling `fetch` ad hoc in components.
  - `auth/`: `authToken.ts`, `components/ProtectedRoute.tsx` (client-side route guard using `authContext`). `events/hooks`: `useEvents`, `useEventDetails`, `useEventLike`. `tickets/hooks`: `usePassManagement`. `profile/hooks`: `useUser`. `dashboard/hooks`: `useActivity`.
- `components/` — shared only: `ui/` (shadcn/ui primitives; `components.json` present, use shadcn CLI conventions, Tailwind + `class-variance-authority` + `tailwind-merge`), `Navbar`, `Footer`, `fonts`, `magicui`.
- `lib/utils.ts` — `cn()` and image-host helpers. `lib/api.ts` — shared API fetch helpers. `types/types.ts` — shared types.
- Backend base URL is injected via `next.config.mjs`'s `env.BACKEND_URL` (from `Client/.env`), not `NEXT_PUBLIC_*`, except `NEXT_PUBLIC_BASE_URL` which is exposed to the browser directly.
- Google OAuth uses `@react-oauth/google`; images are allowed from `res.cloudinary.com` and `api.dicebear.com` (configured in `next.config.mjs`).

## Auth model (cross-cutting)

JWT issued by the backend on `/verify` (Google OAuth), stored client-side in `localStorage` under `accessToken`, sent as `Authorization: Bearer <token>`. Role-based access (`admin` vs regular user) is enforced **server-side only** via `checkRole` in `router.js` — client-side route protection (`ProtectedRoute.tsx`, admin layout) is UX only, not a security boundary. Do not rely on hiding a page client-side to protect admin/dashboard endpoints — the corresponding backend route must also be gated correctly in `router.js`.
