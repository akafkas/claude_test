# Technical Specification (Codex-ready)

## 1) Monorepo layout

```txt
repo/
  apps/
    web/
    cms/
    worker/
  packages/
    db/
    types/
    booking-core/
    channel-core/
    ui/
    config/
  docs/
    prd.md
    technical-spec.md
```

## 2) Stack

- Frontend: Next.js + React
- Backend/CMS/Admin: Payload CMS (Node.js)
- Database: PostgreSQL
- Cache/locks/queues: Redis
- Payments: Stripe
- Storage: S3-compatible object storage
- Async processing: Node.js worker

## 3) Data model and collections

### Identity and tenancy
- `users`
- `organizations`
- `memberships`
- `properties`

### CMS content
- `pages`
- `offers`
- `media` (Payload upload)
- `siteSettings` (property-scoped)

### Inventory and pricing
- `roomTypes`
- `roomUnits`
- `ratePlans`
- `seasonRules`
- `availability` (denormalized daily inventory)
- `taxRules`
- `promoCodes`
- `addOns`

### Reservations and payments
- `guests`
- `bookings`
- `bookingGuests` (optional)
- `payments`
- `bookingEvents` (audit)

### Channel sync
- `channelAccounts`
- `channelMappings`
- `syncJobs`
- `webhookLogs`
- `conflictLogs`

## 4) Globals

- `platformSettings`
  - defaultCurrency
  - supportEmail
  - stripeConfig
  - emailConfig
  - featureFlags
- `emailTemplates`
  - bookingConfirmation
  - paymentReceipt
  - cancellation
  - modification
  - adminNewBooking
  - syncFailure

## 5) API surface

### Public endpoints
- `POST /api/public/search`
- `POST /api/public/quote`
- `POST /api/public/checkout`
- `POST /api/public/confirm`
- `GET /api/public/booking/:bookingNumber`
- `POST /api/public/booking/:bookingNumber/cancel`
- `POST /api/public/booking/:bookingNumber/modify`

### Admin endpoints
- `GET /api/admin/calendar`
- `POST /api/admin/bookings/manual`
- `PATCH /api/admin/bookings/:id`
- `POST /api/admin/bookings/:id/cancel`
- `POST /api/admin/rates/rebuild`
- `POST /api/admin/channels/:channel/sync`
- `POST /api/admin/channels/:channel/retry/:jobId`

### Channel endpoints
- `POST /api/channels/booking-com/webhook`
- `POST /api/channels/airbnb/webhook`
- `GET /api/channels/:channel/health`

## 6) Channel abstraction contract

`packages/channel-core/adapter.ts`

```ts
export interface ChannelAdapter {
  channel: 'booking_com' | 'airbnb';

  validateConfig(config: unknown): Promise<void>;

  pullReservations(args: {
    propertyId: string;
    from?: string;
    to?: string;
  }): Promise<ExternalReservation[]>;

  pushAvailability(args: {
    propertyId: string;
    updates: InventoryUpdate[];
  }): Promise<SyncResult>;

  pushRates(args: {
    propertyId: string;
    updates: RateUpdate[];
  }): Promise<SyncResult>;

  pushRestrictions(args: {
    propertyId: string;
    updates: RestrictionUpdate[];
  }): Promise<SyncResult>;

  parseWebhook(args: {
    headers: Record<string, string>;
    body: unknown;
  }): Promise<ExternalWebhookEvent>;

  acknowledgeWebhook?(args: {
    eventId: string;
  }): Promise<void>;
}
```

**Rule:** no business service may directly depend on provider-specific API shapes.

## 7) Tenancy and authorization requirements

- Every operational query must include tenancy filters:
  - `organizationId`
  - `propertyId` (where applicable)
- Role matrix:
  - Super admin: full access
  - Property admin: org/property scope only
  - Staff: constrained operational access
  - Public: published content and booking endpoints only

## 8) Booking integrity and concurrency

### Required controls
- Transactional booking confirmation
- Row-level lock on affected availability rows
- Redis distributed lock per property/date-range during confirm
- Idempotency keys for checkout/confirm
- Idempotent webhook processing
- Retry-safe background jobs

### Confirmation algorithm (high-level)
1. Acquire Redis lock for property + date-range
2. Start DB transaction
3. Lock availability rows (`FOR UPDATE`)
4. Validate inventory > 0 for each date
5. Create/update booking state
6. Increment `bookedUnits`, recompute `availableUnits`
7. Persist payment and booking event records
8. Commit transaction
9. Enqueue sync and email jobs
10. Release lock

## 9) Worker responsibilities

- Send booking and operational emails
- Execute OTA push/pull sync jobs
- Retry failed jobs with exponential backoff
- Move exhausted jobs to dead-letter queue
- Run scheduled rebuild/reconciliation jobs

## 10) Environment variables

### Shared
- `DATABASE_URL`
- `REDIS_URL`
- `S3_ENDPOINT`
- `S3_BUCKET`
- `S3_ACCESS_KEY`
- `S3_SECRET_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `EMAIL_PROVIDER_API_KEY`
- `EMAIL_FROM`
- `PAYLOAD_SECRET`
- `NEXT_PUBLIC_APP_URL`

### Channels
- `BOOKING_COM_API_KEY`
- `BOOKING_COM_API_SECRET`
- `AIRBNB_API_KEY`
- `AIRBNB_API_SECRET`

## 11) Delivery priorities

1. Inventory and booking correctness
2. Tenant isolation and security
3. Simple property admin UX
4. Fast public pages and booking flow
5. Adapter-based OTA sync architecture

## 12) Explicit non-goals

Do not build in MVP:
- Full PMS
- Housekeeping/accounting modules
- Native mobile apps
- AI pricing
- Loyalty/GDS/corporate contracts/group booking suites
