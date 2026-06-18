# Admin Testing and Validation

## Baseline Validation
- Build check: `npm run build`
- Ensure no TypeScript/compiler errors in changed routes/components.
- Validate critical route flows manually when no dedicated tests exist.

## What to Verify by Change Type

### Route/Layout changes
- Auth-protected routes still redirect unauthenticated users to `/login`.
- Layout shells render correctly across route groups.
- Error/loading fallbacks still trigger properly.

### Sidebar/nav changes
- Enabled links resolve to real routes.
- Disabled links remain non-navigable placeholders.
- Active-state behavior is correct for exact/prefix matching.

### Query/data fetching changes
- Query reads render loading then stable data.
- Empty states are meaningful.
- API failures surface understandable messages.

### Mutation/form changes
- Submission state shown (loading/disabled/error).
- Success path updates UI and data cache/revalidation.
- Validation and backend errors map correctly.

### API client changes
- CSRF and auth cookies still flow.
- 401 refresh behavior still works.
- SSR request context behavior remains intact.

## Practical PR Checklist
- Build passes
- No dead links introduced
- Query/action conventions preserved
- Shared fetcher remains single network path
- No sensitive data committed
