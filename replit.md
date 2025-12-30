# Eichler Glass

## Overview

Eichler Glass is a hyper-local lead generation and booking platform for premium glass cleaning services targeting Eichler and midcentury modern homes in the Bay Area. The platform features city-localized landing pages, Cal.com scheduling integration with $50 deposit capture via Stripe, customer account management, and an admin CMS for managing leads, deposits, and work orders.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **Routing**: Wouter for client-side routing with city-specific dynamic routes (e.g., `/:city`, `/:city/book`)
- **State Management**: TanStack React Query for server state and data fetching
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with a custom midcentury editorial design system featuring Aqua Blue (#5FB3B3) as the primary accent color
- **Design System**: Zero border-radius aesthetic with emphasis on typography, whitespace, and clean editorial layouts

### Backend Architecture
- **Runtime**: Node.js with Express
- **API Pattern**: RESTful API endpoints under `/api/*` prefix
- **Session Management**: Express sessions with PostgreSQL store (connect-pg-simple)
- **Authentication**: 
  - Admin authentication using session-based auth with bcrypt password hashing
  - Customer authentication via Firebase Authentication (email/password, Google OAuth)

### Database Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Location**: `shared/schema.ts` contains all table definitions
- **Core Tables**:
  - `admin_users`: Admin portal authentication
  - `leads`: Customer lead tracking with status workflow (new → contacted → quoted → converted/lost)
  - `deposits`: $50 booking deposits with Stripe integration
  - `work_orders`: Service scheduling and job management with balance tracking
  - `clients`: Converted customers with job history and revenue tracking
- **Migrations**: Drizzle Kit with migrations output to `./migrations`

### Build System
- **Development**: Vite dev server with HMR, proxied through Express
- **Production**: 
  - Client: Vite build to `dist/public`
  - Server: esbuild bundling with selective dependency bundling for optimized cold starts
- **Path Aliases**: `@/` for client source, `@shared/` for shared code, `@assets/` for static assets

### Design System Implementation
The design system enforces a midcentury editorial aesthetic:
- Neutral foundation with Paper (#F4F4F2) backgrounds and Ink (#0B0B0D) text
- Aqua Blue primary accent for all interactive elements
- Zero border-radius on all components
- CSS custom properties for theming with light/dark mode support

## External Dependencies

### Authentication & Identity
- **Firebase Authentication**: Customer-facing auth with email/password and Google OAuth support
- Environment variables: `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_APP_ID`

### Scheduling & Booking
- **Cal.com**: Embedded scheduling widget via `@calcom/embed-react`
- Environment variable: `VITE_CAL_LINK` for the booking calendar link (format: `username/event-type`)
- All "Book Now" and package selection buttons trigger Cal.com modal when configured
- Fallback: Shows "Call to Book" with phone link when Cal.com is not configured
- Includes $50 deposit flow integrated with Stripe

### Payments
- **Stripe**: Payment processing for deposits, refunds, and additional charges
- **stripe-replit-sync**: Handles webhook registration, data synchronization, and schema migrations
- **Payment Flow**:
  1. Customer clicks "Book Now" → BookingIntentDialog captures contact info
  2. Lead is created → Redirects to Stripe checkout for $50 deposit
  3. On success → BookingSuccess page with Cal.com scheduling option
  4. On cancel → BookingCancel page with retry option
- **Admin Capabilities**:
  - Refund captured deposits (admin/deposits with Refund button)
  - Charge customers using saved payment methods (admin/work-orders with Charge feature)
- **Database Fields**:
  - `leads.stripeCustomerId`: Stripe customer ID for saved payment methods
  - `deposits.stripePaymentIntentId`: Payment intent for refunds
  - `deposits.stripeRefundId`: Refund ID after processing
  - `work_orders.stripePaymentIntentId`: Payment intent for final charges
- Environment variables: `STRIPE_SECRET_KEY` (via stripe-replit-sync integration)

### Database
- **PostgreSQL**: Primary data store
- Environment variable: `DATABASE_URL` for connection string
- Session storage via `connect-pg-simple`

### Email Notifications
- **Mailjet**: Transactional emails for workflow notifications
- **Service Location**: `server/emailService.ts`
- **Email Types**:
  - Deposit confirmation (on successful payment)
  - Deposit refund notification
  - Lead conversion welcome email
  - Remaining balance payment received
  - Job completion notification
  - Appointment confirmation
- **Configuration**: Optional - logs to console when credentials not provided
- Environment variables: `MJ_APIKEY_PUBLIC`, `MJ_APIKEY_PRIVATE`, `MJ_SENDER_EMAIL`

### Session Security
- Environment variable: `SESSION_SECRET` required for secure session management

## Admin Portal

### Access
- URL: `/admin`
- Default credentials: `admin` / `admin`

### Features
- **Dashboard**: Real-time statistics for leads, deposits, and work orders
- **Leads Management**: View, update status (new → contacted → quoted → converted/lost), and delete leads
- **Deposits Tracking**: Monitor payment status (pending, captured, refunded)
- **Work Orders**: Manage service scheduling with status workflow (new → scheduled → in_progress → completed → invoiced)
- **Clients Management**: View converted customers with job history and total revenue

### API Endpoints
All admin endpoints require authentication via session cookie:
- `POST /api/admin/auth/login` - Admin login
- `POST /api/admin/auth/logout` - Admin logout
- `GET /api/admin/auth/me` - Get current admin user
- `GET /api/admin/dashboard/stats` - Dashboard statistics
- `GET/POST/PATCH/DELETE /api/admin/leads` - Lead CRUD
- `POST /api/admin/leads/:id/convert` - Convert lead to client with work order
- `GET/POST/PATCH /api/admin/deposits` - Deposit management
- `POST /api/admin/deposits/:id/refund` - Refund a captured deposit
- `GET/POST/PATCH/DELETE /api/admin/work-orders` - Work order CRUD
- `POST /api/admin/work-orders/:id/charge` - Charge customer using saved payment method
- `POST /api/admin/work-orders/:id/charge-balance` - Charge remaining balance on work order
- `GET/POST/PATCH/DELETE /api/admin/clients` - Client CRUD
- `POST /api/contact` - Public contact form (creates lead)