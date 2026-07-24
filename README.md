# FlySmart — Flight Booking Frontend

A production-style React SPA for searching flights, holding seats, completing bookings, and managing flight catalog data as an admin. Built as the client for a **microservices** backend (API Gateway + Flight Service + Booking Service).

<p>
  <a href="https://flight-frontend-eight.vercel.app/"><img alt="Live Demo" src="https://img.shields.io/badge/Live_Demo-Online-2ea44f?style=for-the-badge" /></a>
</p>

![React](https://img.shields.io/badge/React_19-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite_8-646CFF?logo=vite&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router_7-CA4245?logo=reactrouter&logoColor=white)
![Zustand](https://img.shields.io/badge/State-Zustand-443E38)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white)
![Axios](https://img.shields.io/badge/HTTP-Axios-5A29E4?logo=axios&logoColor=white)

> **Microservices repositories** · [Overview](../README.md) · [API Gateway](https://github.com/Sourabh-km13/Api_Gateway_Flight) · [Flight Service](https://github.com/Sourabh-km13/Flight-Service) · [Booking Service](https://github.com/Sourabh-km13/Flight-booking-Service) . [Notification Service](https://github.com/Sourabh-km13/flight-notification-service)

**Live demo:** https://flight-frontend-eight.vercel.app/ · **API:** https://api-gateway-flight.onrender.com

![FlySmart traveler flow](https://github.com/user-attachments/assets/937bf042-88b6-442b-a1f7-8786e7027ed9
)

---

## Why this project

FlySmart demonstrates end-to-end product engineering: authenticated traveler flows, timed booking holds, admin RBAC, and clean separation between customer and admin APIs — all against a real multi-service backend rather than mocks.

---

## Architecture

```text
┌─────────────────────────────────────────────────────────────┐
│  React + Vite SPA (this repo)                               │
│  Customer UI  ·  Admin UI  ·  Zustand auth  ·  Axios clients │
└────────────────────────────┬────────────────────────────────┘
                             │  VITE_API_BASE_URL (default :3001)
                             │  Header: x-access-token
                             ▼
┌─────────────────────────────────────────────────────────────┐
│  API Gateway                                                │
│  Auth / RBAC / rate limit / reverse proxy                   │
├──────────────┬──────────────────────┬───────────────────────┤
│  /api/v1/*   │  /flightservice/*    │  /bookingservice/*    │
│  /admin/*    │  /admin/flightservice│                       │
└──────┬───────┴──────────┬───────────┴───────────┬───────────┘
       │                  │                       │
       ▼                  ▼                       ▼
  Users & Roles      Flight catalog          Bookings,
  (Gateway DB)       seats, inventory        payment hold,
                     (Flight Service)        cron + RabbitMQ
```

| Audience | Entry | Backend surface |
|----------|--------|-----------------|
| Traveler | `/login`, `/signup` | `/api/v1/user/*`, `/flightservice/*`, `/bookingservice/*` |
| Admin | `/admin/signin` | `/admin/signin`, `/admin/flightservice/*` (admin JWT required) |

---

## Capabilities

### Traveler
- Email/password signup and sign-in with JWT persistence
- Dashboard entry for search and ticket history
- City/airport-aware location search with price/sort filters
- Seat hold with a **5-minute payment window** and live countdown
- Booking creation + payment confirmation against the booking service
- Booked tickets list and printable receipt with city/airport details

### Admin
- Dedicated admin sign-in (`POST /admin/signin`) — no public admin signup
- Role-gated `/admin` dashboard (`role === 'admin'` in JWT)
- Full CRUD for **cities, airports, airplanes, and flights** via the admin proxy

### Client engineering
- Route guards for customer and admin sessions (expired JWT cleared automatically)
- Cold-start **wake gate**: on first load the SPA awaits gateway `GET /health` (loading screen) before unlocking routes; session-scoped skip after success
- Layered **in-memory caching** — location catalog, flight list + per-flight detail, and user bookings — with in-flight request de-duplication and stale-while-revalidate (see [Caching](#caching-strategy))
- Shared API response/error helpers for consistent messaging across services
- City/airport labels resolved from catalog data already loaded for search (no extra lookups)
- All caches cleared on logout to prevent cross-user data leakage
- Tailwind v4 UI with a cohesive traveler + admin experience

---

## Caching strategy

All caches are **module-level, in-memory, TTL-based, and keyed by session token** — a consistent pattern across three services. Nothing is persisted to storage (a hard refresh starts cold), which keeps things simple and avoids stale seat counts. Every cache is flushed on logout via `clearAuth`.

| Cache | File | TTL | Technique | Why |
|-------|------|-----|-----------|-----|
| Cities + airports | `services/locationCache.js` | 10 min | **In-flight promise de-dupe** | Static catalog needed by 3 pages; collapses up to 6 requests into 1 |
| All-flights list | `services/flightCache.js` | 60s | TTL + local seat updates | Avoids refetching the full list; seat counts patched after booking |
| Single flight detail | `services/flightCache.js` | 60s | List reuse → per-id map → network | Opening a flight from search does zero network calls |
| User bookings | `services/bookingCache.js` | 30s | **Stale-while-revalidate** + by-id map | Instant list on return; receipt reuses an already-loaded row |

Highlights:
- **In-flight de-duplication** — near-simultaneous mounts share a single pending promise instead of each firing a request.
- **Stale-while-revalidate** — the bookings list returns cached data immediately, then refreshes in the background so the next read is fresh.
- **Cache coherence** — booking/payment invalidate the bookings list; reserving seats patches the flight list cache and evicts the affected detail entry.
- **Layered reads** — `fetchFlightById` resolves from the all-flights cache, then the per-id cache, then the network (and `FlightBookingPage` has an even earlier `location.state` shortcut).

---

## Tech stack

| Layer | Choice |
|-------|--------|
| UI | React 19, React Router 7 |
| Build | Vite 8 |
| State | Zustand + persist |
| HTTP | Axios |
| Styling | Tailwind CSS v4 |
| Auth model | JWT in `x-access-token` |

---

## Project structure

```text
src/
  components/     # Auth shell, booking cards, logout, toast, route guards, wake gate
  contexts/       # Zustand auth store (user, token, role) — clears caches on logout
  hooks/          # useLocationOptions (cached cities + airports)
  pages/          # Dashboard, search, checkout, bookings, receipt, admin
  services/       # Auth/flight/booking/admin APIs + health ping
                  #   flightCache · locationCache · bookingCache
  utils/          # axios instance, JWT helpers, API response parsing, flight normalizers
  App.jsx         # Route map (guards + wake gate)
```

---

## Getting started

### Prerequisites
- Node.js 18+
- Running backend stack (Gateway + Flight Service + Booking Service)
- Gateway reachable (default `http://localhost:3001`)

### Install & run

```bash
npm install
npm run dev
```

Optional env (`.env`):

```bash
VITE_API_BASE_URL=http://localhost:3001
```

| Script | Purpose |
|--------|---------|
| `npm run dev` | Local Vite server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run lint` | ESLint |

---

## Key routes

| Path | Access |
|------|--------|
| `/`, `/dashboard` | Authenticated traveler |
| `/login`, `/signup` | Public |
| `/searchflights` | Authenticated traveler — search & filters |
| `/searchflights/:flightId` | Authenticated traveler — reserve & pay |
| `/bookings` | Authenticated traveler — booked tickets |
| `/bookings/:bookingId` | Authenticated traveler — printable receipt |
| `/admin/signin` | Public (admin credentials) |
| `/admin` | Admin JWT only |

---

## Design decisions

1. **Gateway as the only public API** — the SPA never calls Flight or Booking services directly.
2. **Separate admin client path** — mutations go through `/admin/flightservice`, matching backend RBAC.
3. **JWT role claim for UI gating** — middleware still re-checks admin on every admin proxy request.
4. **Layered client caching for UX** — session-scoped in-memory caches (location, flight list + detail, bookings) with in-flight de-dupe and stale-while-revalidate cut redundant fetches; seat counts update locally after booking, and all caches clear on logout.
5. **Render cold-start wake** — the SPA only pings gateway `/health`. The gateway fire-and-forgets `/health` to Flight and Booking on every call (errors logged, response not delayed) so downstream services wake without exposing their URLs to the frontend.

---

## Skills demonstrated

- **Modern React architecture** — React 19 + React Router 7 with route guards for customer and admin sessions.
- **Client-side performance** — layered in-memory caching with in-flight request de-duplication and stale-while-revalidate.
- **State management** — Zustand store for auth/session with automatic cache invalidation on logout.
- **API integration** — a single shared Axios instance against a gateway, with consistent response/error parsing.
- **UX for distributed systems** — a cold-start wake gate and a live seat-hold payment countdown that mirrors backend expiry.
- **Product thinking** — separate traveler and admin experiences mapped cleanly onto backend RBAC.

---

## License

Released under the MIT License.
