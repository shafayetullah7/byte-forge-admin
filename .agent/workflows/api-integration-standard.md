---
description: ByteForge Admin API integration, calling, and data fetching standards
---

# Admin API Integration & Calling Rules

All API interactions and data fetching in `@byte-forge-admin` MUST follow these standards to ensure security, performance, and idiomatic SolidStart usage.

## 1. Core Principles
- **Asynchronous components are forbidden.** Component functions must be synchronous. Use Solid primitives (`createAsync`, `createResource`) to handle async data.
- **Prefer `createAsync` for route data.** For any data that belongs to a specific page or route, use `createAsync` (from `@solidjs/router`).
- **Use `createResource` for global/client state.** Use `createResource` for non-route-specific data like the global Auth session or client-side metadata that doesn't trigger route transitions.
- **Centralized API Client.** All network requests MUST go through the `apiClient` in `src/lib/api-client.ts` to ensure CSRF protection and silent refresh logic are applied.

## 2. Data Fetching Pattern (The Route Standard)
Follow this 3-layer pattern for all route-level data:

### Layer 1: Define the Query
Wrap fetchers with `query()` and a unique cache key for deduplication.
```tsx
// src/lib/api/categories.ts
import { query } from "@solidjs/router";
import { apiClient } from "../api-client";

export const getCategories = query(async () => {
  return apiClient("/admin/tree-categories");
}, "categories");
```

### Layer 2: Preload in Route
```tsx
// src/routes/categories.tsx
import { getCategories } from "~/lib/api/categories";

export const route = {
  preload: () => getCategories(),
};
```

### Layer 3: Consume with `createAsync`
```tsx
export default function CategoriesPage() {
  const categories = createAsync(() => getCategories());
  return (
    <Suspense fallback={<TableSkeleton />}>
      <CategoryList data={categories()} />
    </Suspense>
  );
}
```

## 3. Mutations & Actions
Use the `action` primitive for state-changing requests (`POST`, `PUT`, `DELETE`).
- **Always revalidate** relevant cache keys after a successful mutation.
- Use the `submission` signal of the action for loading/pending states in the UI.

```tsx
const deleteCategory = action(async (id: string) => {
  await apiClient(`/admin/tree-categories/${id}`, { method: "DELETE" });
  throw revalidate("categories");
}, "delete-category");
```

## 4. Error Handling
- **Do not catch errors inside fetchers** unless you are providing a fallback value.
- Let errors bubble up to **Error Boundaries**.
- Use the `apiClient`'s built-in error parsing to ensure consistent error messages in the UI.

## 5. Security Checklist
- **Credentials**: Always use `credentials: 'include'` (handled by `apiClient`).
- **CSRF**: Ensure `apiClient` correctly injects the `X-XSRF-TOKEN` header for all mutations.
- **Silent Refresh**: The `apiClient` handles token expiration automatically. Do not implement manual interceptors in components.

## 6. Dos and Don'ts

### ✅ DO
- Use **Suspense** boundaries around data-dependent components.
- Use **unique, descriptive cache keys** in `query()`.
- Define **DTS interfaces** for all API responses.
- Keep `api-client.ts` as the single source of truth for network configuration.

### ❌ DON'T
- **No manual `fetch()` calls** in components.
- **No `onMount` fetching** for data that should be SSR-ready.
- **No storage of JWTs in localStorage**. Use the HttpOnly cookies provided by the backend.
- **No multiple loading signals** per component. Rely on Resource/Async states.
