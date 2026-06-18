# Byte Forge Admin - Architecture Overview

## Layered Architecture
- **Route layer**: file-routed pages in `src/routes/**`
- **Composition layer**: layout/domain UI components in `src/components/**`
- **Data access layer**: endpoint modules + fetcher in `src/lib/api/**`
- **Auth/session layer**: session query/action wrappers in `src/lib/auth/**`
- **Config layer**: nav and app-level config in `src/config/**`

## Primary Execution Flow
1. Route component loads (`createFileRoute`-style file route).
2. Layout guard (`(protected).tsx`) resolves `useSession()`.
3. Route uses `createAsync(queryFn)` for reads.
4. Route/forms invoke `action`-based mutations for writes.
5. API endpoint modules call shared `fetcher`.
6. Shared UI components render loading/error/empty/success states.

## Shells and Route Groups
- Auth shell: `(auth)` group for login flow.
- Protected shell: `(protected)` group for admin workspace.
- Feature route clusters include:
  - shops + shop detail tabs
  - taxonomy (tags/tag groups/categories)
  - languages
  - payment methods

## Navigation Architecture
- Sidebar is config-driven from `src/config/admin-nav.ts`.
- Each item includes:
  - label
  - href
  - icon
  - matching mode (`exact`/`prefix`)
  - enabled flag
- Some menu items are intentionally disabled until implementation.

## API Architecture
- Shared fetch transport: `src/lib/api/api-client.ts`.
- Endpoint modules grouped by feature:
  - `auth.api.ts`
  - `shops.*`
  - `tags.*`
  - `tag-groups.*`
  - `categories.*`
  - `languages.*`
  - `payment-methods.*`
  - `media.*`

## Auth and Session Lifecycle
- `getSession` query checks backend auth state.
- `useSession` exposes async session in components.
- `logoutAction` executes server action and redirects to login with revalidation.
- Protected shell redirects unauthenticated users to `/login`.

## Reliability and Error Boundaries
- Global app-level error boundary in `src/app.tsx`.
- Page/inline boundaries used in feature pages.
- Loading fallback patterns standardized via shared components.

## Boundary Principles
- Route files coordinate; endpoint modules communicate.
- Keep auth, API transport, and nav state centralized.
- Avoid route components becoming ad-hoc API clients.
