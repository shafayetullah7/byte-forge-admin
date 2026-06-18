# Byte Forge Admin - Project Constants

## Stack and Runtime
- App framework: SolidStart (`@solidjs/start`) + Solid Router file-based routes
- Rendering/runtime: Vinxi
- Language: TypeScript
- Validation: zod + modular forms
- Package manager: npm scripts in this project (Node >= 22)

## Source Map
- `src/routes/` - file-based routing (auth/protected + feature routes)
- `src/components/` - reusable UI/layout/errors/domain widgets
- `src/lib/api/` - fetch client + endpoint modules + shared API types
- `src/lib/auth/` - session query/action hooks
- `src/config/` - navigation and admin app config
- `src/schemas/` - form schemas (zod)

## Routing and Layout Conventions
- Public/auth shell:
  - `src/routes/(auth).tsx`
  - `src/routes/(auth)/login/(login).tsx`
- Protected shell:
  - `src/routes/(protected).tsx`
  - feature pages under `src/routes/(protected)/**`
- Use route group conventions already present: `(protected)`, `(auth)`, and nested details using `[id]`/`([id])` patterns.

## Data Fetching and Mutations
- Reads should use router `query(...)` and `createAsync(...)` where possible.
- Writes should use router `action(...)` and `useAction/useSubmission`.
- Keep endpoint orchestration in `lib/api/endpoints/**`, not directly in route components.

## API Client Contract
- All network calls should go through `src/lib/api/api-client.ts` (`fetcher`).
- Preserve:
  - cookie forwarding in SSR
  - CSRF header injection for state-changing methods
  - 401 silent-refresh flow
  - optional data unwrap behavior (`unwrapData`)
- Do not bypass fetcher with raw `fetch` for internal API endpoints unless explicitly required.

## Auth and Session Rules
- Session source of truth:
  - `src/lib/auth/session.ts` (`getSession`, `useSession`, `logoutAction`)
- Protected routes should redirect to `/login` when session is null.
- Logout should throw router redirect with revalidation of `admin-session`.

## Navigation Rules
- Sidebar nav source of truth: `src/config/admin-nav.ts`.
- Keep disabled/placeholder sections explicit via `enabled: false`.
- Do not enable nav items for routes that are not implemented.
- For implemented routes, ensure nav labels/hrefs/match mode stay aligned with route behavior.

## UI and Component Conventions
- Reuse shared primitives from `src/components/ui/**`.
- Reuse shared error boundaries/fallbacks from `src/components/errors/**`.
- Route pages should compose:
  - page shell/header
  - feature components
  - clear empty/loading/error states

## Forms and Validation
- Prefer schema-first forms (zod in `src/schemas/**`).
- Keep form validation messages and API error mapping explicit.
- Keep image/media upload interactions through existing hooks/endpoints.

## Error Handling Rules
- Normalize API errors via `ApiError` from `lib/api/types`.
- Show actionable UI feedback (not silent failures) except for deliberate auth session probes.
- Keep consistent error fallback usage (global/page/inline).

## Definition of Done (Admin Frontend)
- Build passes (`npm run build`)
- No lints/TS errors on touched files
- Data read paths use query/createAsync patterns
- Mutation paths use action/useAction/useSubmission patterns
- Session/auth redirect behavior preserved
- Nav and routes stay consistent (no dead enabled links)

## Never Do
- Hardcode API base URLs inside feature files
- Bypass shared fetcher for normal API calls
- Put endpoint business transformations directly in random components when endpoint modules exist
- Enable sidebar links for unimplemented pages
- Break SSR cookie/auth flow in fetcher/session logic
