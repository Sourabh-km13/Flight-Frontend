# FlySmart — Flight Booking Frontend

A production-style React SPA for searching flights, holding seats, completing bookings, and managing flight catalog data as an admin. Built as the client for a **microservices** backend (API Gateway + Flight Service + Booking Service).

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
- Route guards for customer and admin sessions (expired JWT cleared)
- Cold-start **wake gate**: on first load the SPA awaits gateway `GET /health` (loading screen) before unlocking routes; session skip after success
- In-memory **flight list cache** (60s TTL) with seat updates after booking actions
- Shared API response helpers for consistent error messaging
- City/airport labels resolved from catalog data already loaded for search
- Tailwind v4 UI with a cohesive traveler + admin experience

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
  components/     # Auth shell, booking cards, logout, toast, route guards
  contexts/       # Zustand auth store (user, token, role)
  hooks/          # Location options (cities + airports)
  pages/          # Dashboard, search, checkout, bookings, receipt, admin
  services/       # Customer APIs, booking APIs, admin APIs, flight cache
  utils/          # JWT helpers, API response parsing, flight normalizers
  App.jsx         # Route map
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
4. **Client cache for search UX** — reduces repeat full-list fetches while bookings update seat counts locally.
5. **Render cold-start wake** — the SPA only pings gateway `/health`. On the first `/health` after gateway boot, the gateway fire-and-forgets `/health` to Flight and Booking (errors logged, response not delayed) so downstream services wake without exposing their URLs to the frontend.

---

## Related repositories

| Service | Role |
|---------|------|
| [Api_Gateway_Flight](../Api_Gateway_Flight) | Auth, RBAC, rate limiting, reverse proxy |
| [Flight-Service](../Flight-Service) | Airplanes, cities, airports, flights, seat inventory |
| [Flight-booking-Service](../Flight-booking-Service) | Bookings, payment hold, cron expiry, notifications |

---

## License

Private / educational project.
