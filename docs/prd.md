# Product Requirements Document (PRD)

## 1) Product definition

### Product name

White-label multi-tenant hospitality booking platform

### Goal

Build an MVP that lets NOUS launch branded websites for hospitality businesses with:

- Modern marketing site
- Direct booking engine
- CMS/admin panel
- OTA sync capability via a common channel layer

### Target customers

- Boutique hotels
- Villas / apartments
- Small property managers
- Small charter businesses (later, not in MVP)

### Core value

- Replace outdated websites
- Increase direct bookings
- Reduce dependency on third-party booking engines
- Sync rates, availability, and reservations with OTAs
- Give clients one simple dashboard

---

## 2) MVP scope

### In scope

- Multi-tenant architecture
- White-label property websites
- Payload CMS-based admin
- Room / unit inventory
- Rate plans
- Availability management
- Booking search and checkout
- Stripe payments
- Reservation management
- Email confirmations
- Promo codes
- Taxes and fees
- Booking.com / Airbnb sync abstraction layer
- Webhook + polling support for channels
- Basic analytics dashboard

### Out of scope

- Full PMS
- Housekeeping
- Accounting
- Native apps
- AI pricing
- Loyalty
- GDS
- Corporate contracts
- Group bookings
- Travel agent portal

---

## 3) Business requirements

### Tenant types

- NOUS super admin
- Property owner / manager
- Property staff

### Required capabilities

- Create a new property tenant
- Assign branded domain
- Configure rooms, rates, policies, offers
- Publish property website
- Accept direct bookings
- Take card payment / preauth
- Sync inventory and reservations with channels
- View sync issues and retry failed jobs

### Success criteria

- Property can go live in under one day after onboarding
- Guest can complete booking on mobile in a few steps
- No double booking in normal operation
- Staff can manage content and bookings without developer help

---

## 4) Architecture and stack

### Components

1. **Frontend app** (Next.js + React): public sites, booking UI, guest self-service
2. **Core backend** (Payload CMS on Node.js): CMS, auth, admin, booking logic, tenancy, APIs
3. **Worker service** (Node.js): async jobs, OTA sync, emails, retries, schedules
4. **Data and infrastructure**: PostgreSQL, Redis, S3-compatible object storage, Stripe, email provider, monitoring/logging

### Runtime split

- `apps/web` → frontend
- `apps/cms` → Payload app
- `apps/worker` → background jobs
- `packages/*` → shared domain code

---

## 5) Multi-tenant design

### Tenant model

Each property belongs to an organization. All operational records are tenant-scoped.

### Core tenancy entities

- Organization
- Property
- User
- Membership
- Role

### Tenant isolation rule

All admin/API queries must filter by:

- `organizationId`
- `propertyId` where applicable

### Domain model constraints

Each property can have:

- One custom domain
- One fallback subdomain
- One theme config
- One booking config

---

## 6) Functional modules

### Booking engine modules

- **Availability engine**: sellable inventory, restrictions, holds, occupancy filtering
- **Pricing engine**: seasonal pricing, occupancy rules, promos, taxes/fees, breakdowns
- **Reservation engine**: create holds, confirm bookings, release holds, audit logs, queue sync jobs
- **Payment engine**: create/confirm Stripe payment intents, update booking payment state

### Channel sync modules

- Channel account management
- Channel mapping management
- Push/pull sync jobs
- Webhook ingestion and validation
- Conflict logging and retry tooling

---

## 7) Booking lifecycle

### Direct booking flow

1. Guest searches
2. System computes availability and price
3. Guest selects room/rate
4. System creates short-lived quote
5. Guest enters details
6. Payment intent created
7. Payment succeeds
8. Booking confirmed in DB transaction
9. Inventory reduced
10. Sync jobs queued
11. Confirmation email sent

### OTA flow

1. Webhook/polling receives reservation update
2. Adapter normalizes payload
3. Internal booking created/updated idempotently
4. Inventory recalculated
5. Cross-channel updates queued as needed
6. Event logged

---

## 8) Double-booking prevention requirements

Required controls:

- DB transaction for booking confirmation
- Row-level locking for inventory writes
- Redis lock per property/date-range during confirm flow
- Idempotency key on checkout/confirm
- Idempotent webhook processing
- Retry-safe job design

Inventory update strategy per confirmation:

- Lock affected availability rows
- Verify `availableUnits > 0`
- Increment `bookedUnits`
- Recompute `availableUnits`
- Commit transaction
- Enqueue sync jobs

---

## 9) Access control and security

### Roles

- **Super admin**: full platform access
- **Property admin**: full org/property access, no platform settings
- **Staff**: booking/content ops with limits, no credentials/billing
- **Public**: published content + public booking endpoints only

### Security baseline

- Strict tenant-scoped access
- Encrypted secrets and channel credentials
- Webhook signature validation
- No raw card storage
- Audit trail for booking/rate changes

---

## 10) Non-functional requirements

### Performance

- Lighthouse-friendly public pages
- Fast booking search UX
- CMS content caching
- Smart SSR/ISR

### Reliability

- Background retries with backoff
- Dead-letter queue for failed sync jobs
- Structured logging
- Health checks

### Observability

- Error tracking
- Request logs
- Job metrics
- Sync failure dashboard

---

## 11) Suggested implementation milestones

1. Monorepo setup, auth, users/orgs/properties, Payload admin, basic Next rendering
2. Room types/rates/season rules, public property site, theme settings
3. Availability/pricing engines, search results, quote flow
4. Checkout, Stripe, booking creation, email confirmation, reservation admin
5. Denormalized availability, manual booking management, calendar UI
6. Channel adapter abstraction, sync jobs, webhook logs, mock adapter
7. Booking.com + Airbnb adapters, mapping UI, retry/conflict tooling

---

## 12) MVP definition of done

MVP is complete when NOUS can:

- Create a property tenant
- Manage property content in Payload
- Publish branded site on custom domain
- Support guest search, booking, and payment
- Confirm reservation atomically and update inventory
- Send booking confirmation emails
- Let staff manage bookings and rates
- Operate OTA adapter-based ingest/push sync
- View and retry failed sync jobs
