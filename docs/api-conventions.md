# Admin API and Client Conventions

## Transport
- Use `fetcher` from `lib/api/api-client.ts` for all backend communication.
- Keep params in `params` option and rely on `buildURL`.
- Keep `unwrapData` behavior explicit when full envelope/meta is needed.

## Auth/CSRF
- Preserve cookie-based auth flow (`credentials: include`).
- Preserve CSRF injection (`X-XSRF-TOKEN`) for state-changing methods.
- Preserve 401 refresh-retry handling and login redirect behavior.

## Endpoint Module Layout
- Prefer `<feature>.api.ts` for network calls.
- Prefer `<feature>.types.ts` for request/response contracts.
- Prefer `<feature>.actions.ts` for route action wrappers where used.
- Use `index.ts` files for clean feature exports.

## Error Normalization
- Throw/propagate `ApiError` for failed responses.
- Avoid feature-specific ad-hoc error classes unless necessary.
- Keep user-facing messages context-aware in UI layer.

## Query and Action Separation
- Reads:
  - `query` + `createAsync`
- Writes:
  - `action` + `useAction` + `useSubmission`
- Do not use action for simple read-only fetches.
- Do not directly invoke writes from random components without submission state tracking.

## Backward Compatibility
- Maintain expected response fields used by existing routes/components.
- For API shape additions, prefer additive changes.
- Coordinate with backend when changing required request shapes.
