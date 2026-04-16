# Schedulo

A professional scheduling platform — share your availability and let anyone book a meeting in seconds. No back-and-forth emails required.

🔗 **Live Demo**
- Frontend: [https://schedulo-app.vercel.app](https://schedulo-app.vercel.app)
- API: [https://schedulo-api.onrender.com](https://schedulo-api.onrender.com)

---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Frontend | React | 19.2.4 |
| Build Tool | Vite | 8.0.4 |
| Routing | React Router DOM | 7.14.1 |
| State / Data | TanStack React Query | 5.99.0 |
| Styling | Tailwind CSS | 4.2.2 |
| Animations | Framer Motion | 12.38.0 |
| HTTP Client | Axios | 1.15.0 |
| Date Handling | date-fns + date-fns-tz | 4.1.0 / 3.2.0 |
| Calendar UI | react-day-picker | 9.14.0 |
| Backend | Node.js + Express | 18+ / 4.18.0 |
| ORM | Prisma | 5.0.0 |
| Database | MySQL | 8.0 |
| Validation | Zod | 3.22.0 |
| Calendar Sync | Google Calendar API (googleapis) | 144.0.0 |
| Email | Nodemailer | 6.9.0 |
| Security | Helmet + express-rate-limit | 7.0.0 |

---

## Features

### ✅ Event Types Management
- Create event types with name, duration, slug, color, description
- **Event kind**: 1:1 Meeting, Group Session, Webinar, Interview Slot
- **Buffer time** between meetings (0, 5, 10, 15, 30 min)
- **Max meetings per day** cap per event type
- Edit and soft-delete existing event types
- Unique public booking link per event type (`/book/:slug`)
- Copy link + share modal

### ✅ Availability Settings
- Toggle available days of the week
- Set start/end time per day (15-min granularity)
- Timezone selector (stored per user)
- Quick presets (Weekdays 9–5, Mon–Fri 8–6, Every day 10–6)
- **Date-specific overrides** — block a day or set custom hours

### ✅ Public Booking Page
- 3-column layout: host info | calendar | time slots
- Month calendar (only available dates selectable)
- Time slots update when date is selected
- Timezone auto-detected from browser
- Booking form: name + email
- Atomic double-booking prevention (DB transaction)
- Confirmation screen with **Add to Google Calendar** link
- Google Calendar busy slot filtering (when connected)
- Buffer time + max per day enforced

### ✅ Meetings Page
- Upcoming / Past tabs
- Search by name, email, or event type
- Date range filter
- Export CSV
- Cancel meeting (confirmation modal)
- Reschedule meeting (conflict-checked)
- Add to Google Calendar link per meeting

### ✅ Analytics
- Total, confirmed, cancelled meetings
- Conversion rate (page views → bookings)
- By event kind breakdown (1:1, Group, Webinar, Interview)
- Daily bookings chart (last 30 days)
- Busiest days of week chart
- Cancellation rate

### ✅ Google Calendar Integration
- OAuth 2.0 connect/disconnect
- Real-time busy slot sync
- Connected account shown in Settings

### ✅ UI / UX
- Light & dark theme toggle (class-based, persisted)
- Indigo/violet gradient sidebar in light mode
- Fully responsive — mobile hamburger drawer
- Framer Motion animations
- Toast notifications

---

## Local Setup

### Prerequisites
- Node.js 18+
- MySQL 8 running locally

### 1. Clone

```bash
git clone https://github.com/ShreyaThakur05/Schedulo.git
cd Schedulo
```

### 2. Install dependencies

```bash
# Backend
cd server-js && npm install

# Frontend
cd ../client-react && npm install
```

### 3. Configure environment

**`server-js/.env`**
```env
DATABASE_URL="mysql://root:YOUR_PASSWORD@localhost:3306/schedulo"
PORT=4000
FRONTEND_URL="http://localhost:3000"
SEED_USER_ID="00000000-0000-0000-0000-000000000001"

# Email (optional)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your@gmail.com"
SMTP_PASS="your-app-password"
SMTP_FROM="Schedulo <your@gmail.com>"

# Google Calendar OAuth (optional)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GOOGLE_REDIRECT_URI="http://localhost:4000/api/v1/gcal/callback"
```

**`client-react/.env`**
```env
VITE_API_URL=http://localhost:4000/api/v1
```

### 4. Database setup

```bash
cd server-js
npx prisma db push
npm run db:seed
```

### 5. Run

```bash
# Terminal 1 — API
cd server-js && npm run dev

# Terminal 2 — Frontend
cd client-react && npm run dev
```

Open `http://localhost:3000`

---

## Key URLs

| URL | Description |
|---|---|
| `/dashboard` | Manage event types |
| `/availability` | Set weekly schedule + date overrides |
| `/meetings` | View/cancel/reschedule meetings |
| `/analytics` | Booking analytics & conversion rates |
| `/settings` | Google Calendar integration |
| `/book/30-min-chat` | Public booking page |
| `/book/60-min-deep-dive` | Public booking page |
| `/book/15-min-intro` | Public booking page |

---

## API Reference

Base URL: `http://localhost:4000/api/v1`

```
GET    /event-types                  List event types
POST   /event-types                  Create event type
PUT    /event-types/:id              Update event type
DELETE /event-types/:id              Soft-delete event type
GET    /event-types/slug/:slug       Get by slug (increments page views)

GET    /availability                 Get weekly rules
PUT    /availability                 Upsert weekly rules
GET    /availability/slots           Get available slots for a date
GET    /availability/dates           Get available dates for a month
GET    /availability/overrides       List date overrides
PUT    /availability/overrides       Upsert a date override
DELETE /availability/overrides/:date Remove a date override

GET    /meetings                     List meetings (upcoming/past)
POST   /meetings                     Create booking (public)
PATCH  /meetings/:id/cancel          Cancel meeting
PATCH  /meetings/:id/reschedule      Reschedule meeting

GET    /analytics                    Analytics + conversion rates

GET    /gcal/auth-url                Get Google OAuth URL
GET    /gcal/callback                OAuth callback
GET    /gcal/status                  Check connection status
DELETE /gcal/disconnect              Disconnect Google Calendar
```

---

## Deployment

### Backend → Render
- Root directory: `server-js`
- Build command: `npm install && npx prisma generate`
- Start command: `npm start`
- Add all env vars from `server-js/.env`

### Frontend → Vercel
- Root directory: `client-react`
- Framework: Vite
- Build command: `npm run build`
- Output directory: `dist`
- Add env var: `VITE_API_URL=https://your-api.onrender.com/api/v1`

### Database → Railway
- Deploy MySQL on [railway.app](https://railway.app)
- Copy the `DATABASE_URL` into Render env vars

---

## Folder Structure

```
Schedulo/
├── server-js/                 # Express API (plain JavaScript)
│   ├── prisma/
│   │   ├── schema.prisma      # DB schema
│   │   └── seed.js            # Demo data
│   └── src/
│       ├── config/            # db.js, env.js
│       ├── controllers/       # eventType, availability, meeting,
│       │                      # analytics, gcal, override
│       ├── middleware/        # defaultUser, errorHandler, validate
│       ├── routes/            # All route files
│       └── services/          # slotCalculator, emailService
└── client-react/              # React 19 + Vite (plain JavaScript)
    ├── src/
    │   ├── components/
    │   │   ├── features/      # AvailabilityEditor, BookingCalendar,
    │   │   │                  # EventTypeCard, MeetingCard, TimeSlotPicker
    │   │   ├── layout/        # Navbar (responsive sidebar)
    │   │   └── ui/            # Button, Input, Modal, Toast, Spinner
    │   ├── hooks/             # useAvailability, useEventTypes,
    │   │                      # useMeetings, useSlots, useOverrides,
    │   │                      # useAnalytics
    │   ├── lib/               # api.js, queryClient.js, utils.js, theme.jsx
    │   └── pages/
    │       ├── admin/         # Dashboard, Availability, Meetings,
    │       │                  # Analytics, Settings, AdminLayout
    │       └── book/          # BookingPage
    └── vercel.json            # SPA routing config
```

---

## Assumptions

- Single default user (no auth) — `SEED_USER_ID` in `.env`
- Slot granularity: 15 minutes
- One availability rule per day of week
- All times stored as UTC; frontend converts using `Intl.DateTimeFormat`
- Conflict check scoped to same event type
- Soft-delete for event types (preserves meeting history)
- Google Calendar sync reads primary calendar only (read-only scope)
