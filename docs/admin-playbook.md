# Admin Playbook

## Add a New Admin Page
1. Create route file under correct group in `src/routes`.
2. If protected, place it under `(protected)`.
3. Add loading/error/empty states using shared components.
4. Add nav item in `src/config/admin-nav.ts` only when route is production-ready.
5. If not ready yet, keep nav item disabled.

## Add Data Read to a Page
1. Add endpoint function in `lib/api/endpoints/<feature>`.
2. Wrap reusable read in `query(...)` where appropriate.
3. Consume in route via `createAsync(...)`.
4. Ensure type alignment with feature `*.types.ts`.

## Add Mutation (Create/Update/Delete)
1. Add endpoint write call in `lib/api/endpoints/<feature>.api.ts`.
2. Add route-level `action(...)` wrapper (or feature actions file).
3. Trigger via `useAction` and track with `useSubmission`.
4. Handle optimistic/concurrency/API errors in UI cleanly.
5. Revalidate relevant query keys after success.

## Add Form
1. Define/extend zod schema in `src/schemas/**` or feature schema area.
2. Keep field-level validation near schema.
3. Map backend validation errors into user-facing field errors.
4. Keep submit state and error state explicit.

## Add Media Upload
1. Use existing `ImageUpload` and `useImageUpload`.
2. Route media operations through `lib/api/endpoints/media`.
3. Keep preview/upload state local and typed.

## Add New Sidebar Item
1. Add nav entry in `admin-nav.ts` with proper `match`.
2. Use `enabled: false` for placeholders.
3. Avoid enabling dead links.
4. Verify active-state behavior for nested paths.

## Pre-PR Checklist
- `npm run build`
- No TS/lint regressions in touched files
- Route accessible and guarded appropriately
- Query/action separation is preserved
- API transport still routed through shared `fetcher`
- Sidebar and route implementation status aligned
