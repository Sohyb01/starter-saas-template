# Project Instructions (SaaS Starter)

These notes capture the development patterns and conventions used in this repo
so they can be reused in other projects.

## Stack
- Next.js App Router (server components by default, client components when needed)
- Drizzle ORM (Postgres)
- Better Auth (custom session plugin)
- Lemon Squeezy (subscriptions + webhooks)

## Folder Structure (what each area is for)
- `app/`
  - App Router routes and layouts.
  - `app/(pages)/` is the marketing/public section (homepage, pricing, get-started).
  - `app/dashboard/` is the authenticated app area (admin/user dashboards).
  - `app/webhook/` handles inbound webhooks (Lemon Squeezy).
  - `app/api/` contains API routes (Better Auth handler).
  - `app/actions.ts` contains server actions (e.g., revalidate).
- `components/`
  - `components/ui/` is the design system (buttons, table, dropdown, etc).
  - `components/custom/` is project-specific UI (navbars, sidebars, user menus).
  - `components/columns/` is for data-table column definitions.
- `db/`
  - Drizzle schema and query helpers.
  - All DB writes/reads are centralized in `db/queries.ts`.
- `lib/`
  - Integration helpers (auth client, Lemon Squeezy helpers).
  - `lib/lemon-squeezy/server.ts` contains server actions for checkout and products.
- `hooks/`, `types/`, `public/`, `drizzle/`
  - Utility hooks, shared types, static assets, migration/config assets.

## Key Files (what each file is for)
- `auth.ts`
  - Better Auth server config (drizzle adapter, providers, custom session).
  - Exports `getSession()` helper for server-side session access.
- `lib/auth-client.ts`
  - Better Auth client for use in client components (`useSession`, `signIn`, `signOut`).
- `lib/lemon-squeezy/server.ts`
  - Lemon Squeezy setup and server-only helpers:
    - `getSubscriptionProducts`, `handleCheckout`, `createCustomerPortal`.
- `db/schema.ts`
  - Drizzle schema for `user`, `account`, `session`, `products`, `subscriptions`.
- `db/queries.ts`
  - Centralized DB access layer. All functions return `ResponseObj<T>`.
- `app/webhook/payments/route.ts`
  - Lemon Squeezy subscription webhook handler (upserts product, user customerId, subscription).
  - Handles cancellations by forcing `cancelled = true`, `status = "cancelled"`, and `renewsAt = null`.
- `app/(pages)/get-started/CheckoutRedirect.tsx`
  - Client-only redirect step that creates checkout after auth.
  - Uses a `useRef` guard to avoid double creation in dev.

## Server vs Client Pattern
- Default to server components in `app/` unless you need hooks (`useEffect`, `useSession`).
- For auth-aware UI in server components, create a small client island that reads `useSession()`.
  Example: `WebsiteUserNav` renders signed-in menu or CTA.
- Never call `router.push()` during render. Use `useEffect` in client components,
  or use `redirect()` in server components.

## Response Pattern for DB Functions
All functions in `db/queries.ts` return:

```ts
export interface ResponseObj<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  errorCode?: number;
}
```

Helpers:
- `ok(message, data)` returns `{ success: true, message, data }`.
- `fail(message, error, errorCode?)` returns `{ success: false, message, error, errorCode }`.

Usage pattern:
- Always check `res.success` before using `res.data`.
- In server routes, return an error response if `success === false`.

## Subscription Logic Pattern
- Store Lemon Squeezy `customer_id` on `user.customerId`.
- `subscriptions.customerId` always refers to the Lemon Squeezy customer id.
- To check active subscription:
  1. Fetch `user.customerId` by `session.user.id`.
  2. Call `hasSubscriptionEndedByAccountId(customerId)`.
- Checkout is blocked if user already has an active subscription.

## Webhook Pattern
- Verify Lemon Squeezy signature via `X-Signature`.
- On subscription events:
  - Upsert product and customer id.
  - Upsert subscription (latest data wins).
  - If event is `subscription_cancelled`, force `cancelled=true`, `status="cancelled"`,
    and `renewsAt=null`.

## UI Data Tables
- Use `components/ui/data-table.tsx` for standard table UI.
- Place column definitions in `components/columns/`.
  Example: `UserSubscriptionsColumns`.

