# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repo layout

Two independent Node projects in one repo, no shared root package.json/workspace tooling:

- `Client/` — Next.js 14 (App Router) + TypeScript frontend, deployed on Vercel.
- `Server/` — Express + MongoDB (Mongoose) REST API backend, deployed via Docker.

Each has its own `package.json`, `.env`, and `node_modules`. Run commands from inside the respective directory.

## Commands

### Client (`Client/`)
```bash
npm run dev       # start dev server (localhost:3000)
npm run build     # production build
npm run start     # serve production build
npm run lint      # next lint
npm run analyze   # build with bundle analyzer (ANALYZE=true)
```
No test suite is configured.

### Server (`Server/`)
```bash
npm run dev       # nodemon src/server.js (auto-reload)
npm start         # node src/server.js
npm run seed      # node src/seed.js
```
No test suite is configured. Required env vars (`Server/.env`): `DB_URL`, `PORT`, `SECRET`, `CLIENT_ID`, `CLIENT_SECRET`, `REDIRECT_URI`, `EMAIL_USER`, `EMAIL_PASSWORD`, `PHONEPE_CLIENT_ID`, `PHONEPE_CLIENT_SECRET`, `PHONEPE_CLIENT_VERSION`, `PHONEPE_WEBHOOK_USERNAME`, `PHONEPE_WEBHOOK_PASSWORD`, `BASE_URL`, `FRONTEND_URL`, `NODE_ENV`.

### Docker
`Server/Dockerfile` + `Server/docker-compose.yml` build/run the API (maps host `4890` → container `8000`). `.github/workflows/docker.yml` runs the image build in CI.

## Backend architecture (`Server/src`)

Layered Express app, single router file, no framework-level DI:

- `server.js` — app bootstrap: CORS, security headers (CSP set per-route in router), body parsing, cookie parsing, custom logger (`util/logger.js`, uses `rotating-file-stream`), Mongoose connection, `express-custom-error` for centralized error handling.
- `routes/router.js` — **all routes are registered in this single file**, in a specific, order-sensitive sequence:
  1. Public/unauthenticated routes first (payment callback, `getEvents`, `getEventById`, `/verify` login, `/logout`).
  2. `router.use(auth.verifyToken)` — everything registered *after* this line requires a JWT (`Authorization: Bearer <token>`) verified in `middleware/oauth.js`, which attaches `req.user` from Mongo.
  3. `router.use(checkRole(["admin"]))` — everything after this additionally requires `req.user.role === "admin"` (`middleware/role.middleware.js`).
  - When adding a route, its position relative to these two `router.use()` calls determines its auth level — there's no per-route decorator.
  - `dashboard.routes.js` is mounted separately at `/dashboard` and has its own auth requirements.
- `controllers/*.controller.js` — request handlers, one file per domain (events, passes/tickets, registration, dashboard, contact). `authentication.js` (not suffixed `.controller.js`) handles Google OAuth login/logout.
- `models/*.model.js` — Mongoose schemas (events, users, passes, registration, contactUs, InfluencerRegistration, reqEvent).
- `schemas/*.schema.js` — Zod/Joi validation schemas for request bodies (separate from Mongoose models).
- `helpers/` — cross-cutting logic: `authHelper.js`, `email.service.js` (+ `email_templates/`), `validatorHelper.js`, `verify.team.js`, `websocket.js` (`ws` package).
- `service/cloudinary.js` — image upload integration.
- Payments go through PhonePe: `/api/payment/callback/:merchantOrderId` (public, explicitly bypassed in `verifyToken`), `/payment/webhook` (raw body parsing via `express.raw`), and ticket/pass booking routes (`/api/book-ticket`, `/bookPass`, `/api/getTix`, `/api/passbyuuid/:passUUID`).

## Frontend architecture (`Client/src`)

- `app/` — Next.js App Router pages. Notable routes: `dashboard/` (organizer dashboard: bookmarks, hosted, registered, profile, recent-activity), `admin/` (admin-only tools: event creation, QR scanner), `event/[id]/` and `eventPage/` (with an intercepting route `eventPage/(..)event/[id]/` for modal-style event previews), ticket status pages (`ticket/success|pending|failure`).
- `lib/authContext.tsx` — global sign-in state via React Context, backed by `accessToken` in `localStorage` (not cookies/session). `useAuth()` hook throws outside the provider.
- `lib/services/eventApi.ts` — typed fetch wrappers for backend calls; reads `BACKEND_URL` from env and attaches the bearer token from `localStorage` via `authHeaders()`. Follow this pattern (typed function, `authHeaders()`, throw parsed error body on `!res.ok`) when adding new API calls rather than calling `fetch` ad hoc in components.
- `lib/hooks/` — data-fetching/domain hooks (`useEvents`, `useEventDetails`, `useEventLike`, `usePassManagement`, `useTeamRegistration`, `useFriendManager`, `useUser`, `useActivity`).
- `components/ui/` — shadcn/ui primitives (`components.json` present — use the shadcn CLI conventions for new primitives, Tailwind + `class-variance-authority` + `tailwind-merge`).
- `components/ProtectedRoute.tsx` — client-side route guarding based on `authContext`.
- Backend base URL is injected via `next.config.mjs`'s `env.BACKEND_URL` (from `Client/.env`), not `NEXT_PUBLIC_*`, except `NEXT_PUBLIC_BASE_URL` which is exposed to the browser directly.
- Google OAuth uses `@react-oauth/google`; images are allowed from `res.cloudinary.com` and `api.dicebear.com` (configured in `next.config.mjs`).

## Auth model (cross-cutting)

JWT issued by the backend on `/verify` (Google OAuth), stored client-side in `localStorage` under `accessToken`, sent as `Authorization: Bearer <token>`. Role-based access (`admin` vs regular user) is enforced **server-side only** via `checkRole` in `router.js` — client-side route protection (`ProtectedRoute.tsx`, admin layout) is UX only, not a security boundary. Do not rely on hiding a page client-side to protect admin/dashboard endpoints — the corresponding backend route must also be gated correctly in `router.js`.
