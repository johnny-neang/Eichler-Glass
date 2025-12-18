# Eichler Glass — Hyper‑Local Lead Gen + Booking Platform (Bay Area)

This document is a build spec (site map + configuration notes) for **Eichler Glass**, a hyper‑local home services lead gen website with city‑localized landing pages, Cal.com scheduling with a **$50 deposit**, customer accounts, and an internal admin dashboard.

---

## Goals

- **Hyper‑local acquisition:** dedicated pages per Bay Area city (start with **Castro Valley, Concord, Walnut Creek**).
- **Fast booking:** Cal.com booking flow with a **$50 deposit** to secure a day.
- **Clear pricing:** simple packages and a clean comparison.
- **Customer portal:** view appointments + deposit transactions; cancellation link connected via Stripe.
- **Admin portal (CMS):** manage opportunities, status, assignments, refunds/extra charges, and email threads.
- **Infrastructure:** Firebase Auth (email + Google + Apple), Cal.com + Stripe, Mailjet.

---

## Stack Recommendation

**Frontend / Web App**
- **Next.js (App Router)** + TypeScript
- TailwindCSS + shadcn/ui (optional)
- Hosting: Replit, Vercel, or Firebase Hosting (either works)

**Auth**
- Firebase Authentication:
  - Email/password
  - Google OAuth
  - Apple Sign‑In (Apple Developer setup required)

**Data**
- Firestore for:
  - Users
  - City page config/content
  - Leads/opportunities
  - Booking records (synced from Cal.com webhooks)
  - Stripe transaction references (synced from Stripe webhooks)
  - Admin notes + assignments
  - Email conversation metadata (Mailjet)

**Payments**
- Stripe:
  - Deposit capture (via Cal.com Stripe integration)
  - Refunds
  - Additional charges (admin‑initiated PaymentIntent/Invoice when possible)

**Email**
- Mailjet transactional:
  - Deposit confirmation
  - “We’ll reach out to confirm time & final price”
  - Cancellation + refund confirmations
  - Admin‑to‑customer email (optional)

**Webhooks**
- Next.js Route Handlers (or Firebase Cloud Functions):
  - Cal.com webhook receiver
  - Stripe webhook receiver
  - Mailjet webhook receiver (delivery events + optional inbound)

**AI Agent**
- On‑site chat:
  - Collects lead details (city, tier, dates, address, notes)
  - Creates a lead/opportunity in Firestore
  - Routes to booking or “request a call”
  - Never collects or stores payment details

---

## Site Map

### Public
- `/` — global landing + city selection + redirect logic
- `/cities` — city directory
- `/[city-slug]` — localized landing page
  - `/[city-slug]/pricing`
  - `/[city-slug]/book`
  - `/[city-slug]/faq`
- `/services` — overview
  - `/services/interior`
  - `/services/interior-exterior`
  - `/services/skylight`
- `/contact` — form + phone + AI agent
- `/terms`
- `/privacy`
- `/cancellation` — policy + manage cancellation CTA

### Auth + Customer
- `/sign-in`
- `/sign-up` (supports “guest → create account”)
- `/verify-email`
- `/account`
  - `/account/appointments`
  - `/account/payments`
  - `/account/profile`

### Admin (Protected)
- `/admin`
  - `/admin/opportunities`
  - `/admin/opportunities/[id]`
  - `/admin/users`
  - `/admin/cities`
  - `/admin/templates` (optional)
  - `/admin/settings`

---

## City Localization + Auto‑Redirect

### Initial cities
- `castro-valley`
- `concord`
- `walnut-creek`

### Behavior
- `/` attempts to route a visitor to the most relevant city page:
  1. Ask for browser geolocation (best accuracy, user‑consented)
  2. Fallback: IP‑approx geolocation
  3. Final fallback: city picker
- Always show “Not in this city?” to switch manually.

### Implementation note
- Store city config in `cities/{citySlug}` so you can add cities without code deploys.

---

## Services + Pricing

- **Interior — $250**
- **Interior + Exterior — $400**
- **Interior + Exterior + Skylight — $650**

### Deposit
- **$50 deposit** via Cal.com + Stripe to reserve a day.
- After deposit: user receives confirmation + “we’ll contact you to confirm exact time & final price.”

---

## Booking Flow (Cal.com + Stripe)


> **Payments:** Enable Cal.com’s Stripe payments for the event type so the booking collects a **$50 deposit** before confirmation.


### `/[city]/book`
- Package selection + address/notes form.
- Cal.com embed (city‑specific event type URL or a single unified event type with city + package questions).

### After booking
- Cal.com webhook → create:
  - `booking` record
  - `opportunity` record with status `deposit_received`
- Trigger Mailjet email confirmation.

---

## Account Flows

### Guest booking
- User books with email (no account required).
- System sends:
  - Deposit confirmation email
  - “Create your account to manage bookings” link
- When user registers with same email, link historical bookings.

### Logged‑in booking
- Prefill name/email into booking fields.
- Customer portal shows appointments + deposits/refunds.

---

## Cancellation + Stripe

Because deposit is captured via **Cal.com → Stripe**, pick one approach:

### Option A (Recommended): Stripe Customer Portal
- If Stripe customer ID is available (from webhook mapping), allow “Manage payments” from `/account/payments`.

### Option B: Signed cancellation link + controlled refunds
- Email includes a cancellation link with a signed token:
  - `/cancellation?booking=...&token=...`
- Cancellation action:
  - marks Firestore booking canceled
  - triggers Stripe refund (full/partial per policy)
  - emails customer + notifies admin

---

## Admin Dashboard (CMS)

### Pipeline statuses
- `new_lead`
- `deposit_received`
- `contacted`
- `scheduled`
- `completed`
- `canceled`
- `refunded`

### Admin actions
- View “opportunities pending” with deposit
- Call / email customer
- Change status
- Assign to account manager
- Add notes
- Refund deposit
- Charge additional amount (if feasible) or send invoice link
- View email thread metadata (and optionally reply via Mailjet)

### Roles
- Firebase custom claims:
  - `admin`
  - `manager`
  - `viewer`

---

## Firestore Data Model

### `users/{uid}`
```json
{
  "email": "string",
  "displayName": "string",
  "phone": "string|null",
  "roles": { "admin": false, "manager": false, "viewer": false },
  "createdAt": "timestamp"
}
```

### `cities/{citySlug}`
```json
{
  "name": "Walnut Creek",
  "county": "Contra Costa",
  "hero": { "headline": "", "subheadline": "", "image": "" },
  "serviceArea": ["Walnut Creek", "Pleasant Hill", "Concord"],
  "cal": { "eventTypeUrl": "https://cal.com/..." },
  "seo": { "title": "", "description": "" }
}
```

### `bookings/{id}`
```json
{
  "citySlug": "concord",
  "serviceTier": "interior|interior_exterior|full_skylight",
  "userEmail": "string",
  "userUid": "uid|null",
  "address": "string",
  "notes": "string|null",
  "cal": {
    "eventUri": "string",
    "inviteeUri": "string",
    "startTime": "string",
    "endTime": "string",
    "timezone": "string"
  },
  "deposit": { "amount": 50, "currency": "usd", "status": "paid|refunded" },
  "stripe": { "customerId": "string|null", "paymentIntentId": "string|null", "chargeId": "string|null" },
  "status": "scheduled|canceled|completed",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

### `opportunities/{id}`
```json
{
  "bookingId": "bookingDocId|null",
  "citySlug": "castro-valley",
  "serviceTier": "interior|interior_exterior|full_skylight",
  "priceQuoted": 250,
  "depositAmount": 50,
  "customer": { "name": "string", "email": "string", "phone": "string|null", "address": "string" },
  "status": "deposit_received",
  "assignedToUid": "uid|null",
  "notes": [{ "byUid": "uid", "text": "string", "createdAt": "timestamp" }],
  "stripe": { "customerId": "string|null", "paymentIntentId": "string|null", "chargeId": "string|null" },
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

### `emails/{id}` (optional)
```json
{
  "direction": "outbound|inbound",
  "to": ["string"],
  "from": "string",
  "subject": "string",
  "text": "string",
  "relatedOpportunityId": "string|null",
  "mailjet": { "messageId": "string|null" },
  "createdAt": "timestamp"
}
```

---

## Webhook Endpoints (Server)


> **Webhook verification (Cal.com):** Cal.com can sign webhook payloads with an HMAC-SHA256 signature header `X-Cal-Signature-256`. Store your shared secret in `CAL_WEBHOOK_SECRET` and verify signatures on every webhook request.


- `POST /api/webhooks/cal`
  - verify signature
  - upsert booking + opportunity
  - send Mailjet confirmation
- `POST /api/webhooks/stripe`
  - verify signature
  - update deposit/refund records
- `POST /api/admin/refund` (admin only)
- `POST /api/admin/charge` (admin only)

---

## Environment Variables

Create `.env.local` (or Replit Secrets):

```bash
# Firebase (client)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Firebase Admin (server)
FIREBASE_ADMIN_PROJECT_ID=
FIREBASE_ADMIN_CLIENT_EMAIL=
FIREBASE_ADMIN_PRIVATE_KEY=

# Cal.com
CALENDLY_WEBHOOK_SIGNING_KEY=
CALENDLY_API_TOKEN=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_CUSTOMER_PORTAL_RETURN_URL=https://yourdomain.com/account/payments

# Mailjet
MAILJET_API_KEY=
MAILJET_API_SECRET=
MAILJET_FROM_EMAIL=hello@sparklyhomes.com
MAILJET_FROM_NAME=Eichler Glass
```

---

## Build Order (MVP)

1. Next.js scaffold + theme
2. City landing pages + city selector
3. Booking page w/ Cal.com embed + deposit messaging
4. Firebase auth (email + Google; add Apple after)
5. Cal.com webhook → Firestore booking/opportunity
6. Mailjet deposit confirmation email
7. Customer portal (appointments + payments)
8. Admin dashboard (pipeline + detail + status/assign/notes)
9. Stripe webhook + refunds
10. AI agent lead intake widget + polish

---

## Notes / Risks to Track

- **Cal.com→Stripe linkage:** ensure your webhook data includes enough identifiers to associate a Cal.com booking to a Stripe charge/customer. If not, consider moving deposit capture to your own Stripe Checkout, and use Cal.com for scheduling only.
- **Apple Sign‑In:** requires Apple Developer setup + domain verification; plan time accordingly.
- **Cancellation policy:** define refund window and any fees, then bake it into email + `/cancellation` page + portal controls.
