# Eichler Glass

## Overview

Eichler Glass is a static marketing website for premium glass cleaning services targeting Eichler and midcentury modern homes in the Bay Area. The platform features city-localized landing pages and Cal.com integration for scheduling and payments. All booking and payment processing is handled through Cal.com.
Website URL: https://www.eichlerglass.com/

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **Routing**: Wouter for client-side routing with city-specific dynamic routes (e.g., `/:city`, `/:city/book`)
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with a custom midcentury editorial design system featuring Aqua Blue (#5FB3B3) as the primary accent color
- **Design System**: Zero border-radius aesthetic with emphasis on typography, whitespace, and clean editorial layouts

### Build System
- **Development**: Vite dev server with HMR on port 5000
- **Production**: Static build to `dist/public` - can be deployed to any static hosting
- **Path Aliases**: `@/` for client source, `@assets/` for static assets

### Design System Implementation
The design system enforces a midcentury editorial aesthetic:
- Neutral foundation with Paper (#F4F4F2) backgrounds and Ink (#0B0B0D) text
- Aqua Blue primary accent for all interactive elements
- Zero border-radius on all components
- CSS custom properties for theming with light/dark mode support

## External Dependencies

### Scheduling & Booking
- **Cal.com**: Embedded scheduling widget via `@calcom/embed-react`
- Environment variable: `VITE_CAL_LINK` for the booking calendar link (format: `username/event-type`)
- Current value: `owner-eichlerglass-ltv9yb/30min`
- All "Book Now" and package selection buttons trigger Cal.com modal
- Configure deposits and payments directly in Cal.com's Stripe integration

### Payments
- Payments are handled through Cal.com's built-in Stripe integration
- Configure payment collection in your Cal.com event type settings
- No custom payment processing in this application

## Public Pages

### Main Pages
- **Home** (`/`) - Main landing page with hero, services overview, pricing, testimonials
- **Pricing** (`/pricing`) - Detailed pricing packages
- **Services** (`/services`) - Service descriptions and features
- **Book** (`/book`) - Direct Cal.com booking embed
- **Contact** (`/contact`) - Contact form and business information
- **Team** (`/team`) - Team information

### City Landing Pages
- **City Landing** (`/:city`) - City-specific landing pages (e.g., `/castro-valley`, `/walnut-creek`, `/willow-glen`)
- **City Book** (`/:city/book`) - City-specific booking page
- **City Pricing** (`/:city/pricing`) - City-specific pricing page

### Service Areas (11 cities, 30+ neighborhoods)
- Castro Valley (Greenridge)
- Concord (Parkside, Rancho del Diablo)
- Foster City (Bay Vista, Marina Point, Treasure Isle)
- Mountain View (Cuesta Park, Monta Loma, Sylvan Park)
- Oakland (Sequoyah Hills)
- Palo Alto (Greenmeadow, Midtown)
- San Jose (Willow Glen, Cambrian Park, South San Jose)
- San Mateo (San Mateo Highlands)
- San Rafael (Terra Linda, Lucas Valley)
- Sunnyvale (Fairwood, Cherry Chase)
- Walnut Creek (Rancho San Miguel)

### Legal & Policy Pages
- **Privacy Policy** (`/privacy`) - Comprehensive privacy policy
- **Terms of Service** (`/terms`) - Complete terms of service
- **Cancellation Policy** (`/cancellation`) - Fair cancellation policy with timeline-based handling

## Running the Application

### Development
```bash
cd client && npx vite --host 0.0.0.0 --port 5000
```

### Production Build
```bash
cd client && npx vite build
```
Output: `dist/public/`

## Cal.com Configuration

To set up Cal.com for this application:
1. Create a Cal.com account
2. Create an event type for glass cleaning consultations
3. Enable Stripe payments in the event type settings
4. Set the `VITE_CAL_LINK` environment variable to `your-username/your-event-type`
5. Configure payment amount (e.g., $50 deposit) in Cal.com

All booking, scheduling, customer data, and payment processing is managed through Cal.com's dashboard.
