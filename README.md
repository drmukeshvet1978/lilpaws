# Lil Paws Dog Clinic & Pet Shop — Full-Stack Website

A complete, production-ready website for **Lil Paws Dog Clinic & Pet Shop** (Dr. Mukesh Tiwari), Kolar Road, Bhopal — covering both the veterinary clinic and the pet shop side of the business, with a real appointment booking system and a full CMS admin panel.

## Tech Stack

**Frontend:** React 18, React Router, Tailwind CSS, Framer Motion, Lucide Icons, Axios, Vite
**Backend:** Node.js, Express, MongoDB (Mongoose), JWT auth, bcrypt, Multer, Cloudinary
**Security:** Helmet, CORS allow-list, rate limiting, Mongo sanitization, input validation

## Project Structure

```
lilpaws/
├── backend/
│   ├── config/          # MongoDB + Cloudinary config
│   ├── models/          # Mongoose schemas
│   ├── controllers/      # Route handlers / business logic
│   ├── routes/           # Express route definitions
│   ├── middleware/       # auth, upload, error handling, rate limiting
│   ├── utils/             # token, Cloudinary helpers, availability engine
│   ├── seed/seed.js       # Seed script (admin account + placeholder content)
│   ├── server.js
│   ├── package.json
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── api/            # Axios instance + all API service calls
    │   ├── components/     # Shared UI (Navbar, Footer, forms, cards...)
    │   ├── components/admin/  # Admin-only UI primitives
    │   ├── context/        # Auth context
    │   ├── hooks/           # useSiteSettings, etc.
    │   ├── pages/            # Public pages
    │   └── pages/admin/      # Admin panel pages
    ├── package.json
    └── .env.example
```

## Local Setup

### Prerequisites
- Node.js 18+
- A MongoDB instance (local `mongod` or MongoDB Atlas)
- A Cloudinary account (free tier is enough) for image uploads

### 1. Backend

```bash
cd backend
cp .env.example .env
# edit .env with your MongoDB URI, JWT secret, Cloudinary credentials, etc.
npm install
npm run seed     # creates the admin account + placeholder content
npm run dev      # starts the API on http://localhost:5000
```

The seed script prints the admin login email/password to the console — **log in and change the password immediately** from Admin Panel → Admin Profile.

### 2. Frontend

```bash
cd frontend
cp .env.example .env
# set VITE_API_URL to your backend URL (defaults to http://localhost:5000/api)
npm install
npm run dev       # starts the site on http://localhost:5173
```

Visit `http://localhost:5173` for the public site and `http://localhost:5173/admin/login` for the admin panel.

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description |
|---|---|
| `PORT` | API port (default 5000) |
| `NODE_ENV` | `development` or `production` |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Long random string used to sign admin JWTs |
| `JWT_EXPIRES_IN` | Token lifetime, e.g. `7d` |
| `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | Cloudinary credentials |
| `CLIENT_URLS` | Comma-separated list of allowed frontend origins (CORS) |
| `APPOINTMENT_RATE_LIMIT_WINDOW_MINUTES` / `APPOINTMENT_RATE_LIMIT_MAX` | Public appointment-submission rate limiting |
| `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` / `SEED_ADMIN_NAME` | Used only once by `npm run seed` |

### Frontend (`frontend/.env`)

| Variable | Description |
|---|---|
| `VITE_API_URL` | Base URL of the backend API, e.g. `https://api.yourclinic.com/api` |

## What Was Seeded vs. What You Must Add

To respect "don't invent business information," the seed script only creates:
- One real admin account (from your `.env` values)
- Placeholder **inactive** services (Veterinary Consultation, Vaccination, Grooming, etc.) — enable and edit the real ones from **Admin → Services**
- Generic FAQs — edit/replace from **Admin → FAQs**
- One clearly-labeled, **inactive** demo testimonial — never shown publicly, delete or replace it
- Empty homepage/about/contact/business-hours documents — fill these in from the admin panel

No fake statistics, awards, certifications, or reviews are presented as real anywhere in the codebase.

## Core Feature: Appointment Availability Logic

Appointment slots are never hardcoded. The backend (`backend/utils/availabilityHelper.js`):
1. Reads the weekly business hours + slot duration + breaks from **Admin → Business Hours**
2. Subtracts holidays, blocked dates, and blocked slots from **Admin → Appointment Settings**
3. Counts existing (non-cancelled) bookings per slot and compares against **Max Appointments Per Slot**
4. Re-validates the exact slot again at the moment of booking (`isSlotStillAvailable`) to minimize race conditions/double-booking
5. The frontend never invents slots — it only ever renders what `/api/availability?date=...` returns

## Admin Panel

Login at `/admin/login`. The sidebar covers: Dashboard (real stats, not hardcoded), Appointments (search/filter/status/reschedule/notes), Services, Products, Gallery (Cloudinary uploads), Testimonials, FAQs, About/Doctor, Homepage CMS, Contact Information, Business Hours, Appointment Settings, SEO Settings, and Admin Profile (with password change).

## Production Deployment

### Backend
1. Provision MongoDB (e.g. MongoDB Atlas) and a Cloudinary account.
2. Deploy the `backend/` folder to any Node host (Render, Railway, a VPS, etc.).
3. Set all environment variables from the table above on the host — **never commit `.env`**.
4. Set `CLIENT_URLS` to your deployed frontend's exact origin(s).
5. Run `npm run seed` once against the production database to create the real admin account, then immediately change the password.
6. Start with `npm start`.

### Frontend
1. Set `VITE_API_URL` to your deployed backend's `/api` URL.
2. `npm run build` produces a static `dist/` folder.
3. Deploy `dist/` to any static host (Vercel, Netlify, Cloudflare Pages, or your own Nginx/Apache server). Configure the host to redirect all routes to `index.html` (SPA fallback) so React Router works on refresh.

### Checklist before going live
- [ ] Changed the seeded admin password
- [ ] Filled in real address/phone/WhatsApp/email/Google Maps in Admin → Contact Information
- [ ] Reviewed and enabled the real services in Admin → Services (all seeded ones start inactive)
- [ ] Added real products, gallery photos, and testimonials (delete the demo testimonial)
- [ ] Set correct weekly Business Hours and any known holidays/blocked dates
- [ ] Set SEO meta title/description/OG image in Admin → SEO Settings
- [ ] Confirmed `CLIENT_URLS` / CORS only allows your real domain(s)
- [ ] Confirmed Cloudinary, MongoDB and JWT secrets are production values, not defaults

## Testing the Core Flows Locally

**Public:** homepage loads → services/products/gallery load from the API → pick a service and date on `/appointments` → available slots load live → submit → confirmation screen with a generated Appointment ID appears → booking that same slot again is rejected.

**Admin:** log in → dashboard shows real counts → the new appointment appears in Admin → Appointments → change its status / reschedule it → add/edit a service, product, gallery image, testimonial, FAQ → edit About/Homepage/Contact/Business Hours/Appointment Settings/SEO and confirm the public site reflects the change.
