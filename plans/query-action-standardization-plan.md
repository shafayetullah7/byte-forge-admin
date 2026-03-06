# Query vs Action Standardization Plan

## Current State

- **Queries**: Used in `.api.ts` files for data fetching (`getTagGroups`, `getTagsByGroup`, `getCategoryTree`)
- **Mutations**: Currently use plain async functions without `query` or `action`
- **No `action` usage exists** in the codebase yet

## Problem

Inconsistent approach leads to:
1. Cache revalidation scattered across different places
2. No server-side mutation handling
3. Cannot leverage SolidJS router's `action` benefits (useForm, optimistic updates)

## Standardization Rules

### When to use `query`

| Use Case | Location | Pattern |
|----------|----------|---------|
| Data fetching (GET) | `.api.ts` | `export const getXxx = query(async (...) => {...}, "cache-key")` |
| Read-only operations | `.api.ts` | Returns cached data with automatic revalidation |
| Translation fetching | `.api.ts` | `export const getXxxTranslations = query(...)` |

**Rule**: All data-fetching functions that should be cached use `query`.

### When to use `action`

| Use Case | Location | Pattern |
|----------|----------|---------|
| Data mutations (POST/PATCH/DELETE) | `.actions.ts` | `export const createXxx = action(async (data) => {...})` |
| Form submissions | `.actions.ts` | Returns result and triggers revalidation |
| Server-side mutations | `.actions.ts` | Handles form validation and error states |

**Rule**: All mutations should use `action` - NOT plain async functions.

### When to use plain async functions

| Use Case | Location | Pattern |
|----------|----------|---------|
| Non-mutating server calls | Utilities | Simple API wrappers without SolidJS caching |

---

## Detailed Implementation Rules

### Rule 1: Query Functions (.api.ts)

```typescript
// ✅ CORRECT - Using query wrapper
export const getTagsByGroup = query(async (params: TagListParams) => {
  const result = await apiClient<PaginatedResponse<Tag>>(url, { unwrapData: false });
  return (result.data as Tag[]) || [];
}, "tags-by-group");

// ✅ CORRECT - Translation queries also use query
export const getTagGroupTranslations = query(async (groupId: string) => {
  return apiClient<TagGroupTranslation[]>(`/admin/tag-groups/${groupId}/translations`);
}, "tag-group-translations");

// ❌ WRONG - Plain async for data fetching
export async function getData() { ... }
```

### Rule 2: Action Functions (.actions.ts)

```typescript
// ✅ CORRECT - Must have "use action" directive AND action wrapper
"use action";
import { action, revalidate } from "@solidjs/router";

// ✅ CORRECT - Using action wrapper with cache key
export const createTag = action(async (groupId: string, data: CreateTagDto) => {
  const result = await apiClient(`/admin/tag-groups/${groupId}/tags`, {
    method: "POST",
    body: JSON.stringify(data),
  });
  revalidate("tag-groups");
  revalidate(["tag-group-detail", groupId]);
  return result;
}, "create-tag");

// ❌ WRONG - Missing "use action" directive
export async function createTag(data) { ... }

// ❌ WRONG - Plain async function
export async function createTag(data) { ... }
```

> **CRITICAL**: The `"use action"` directive at the very top of `.actions.ts` files is required for SolidJS Router's action functions to work properly.

### Rule 3: Revalidation Strategy

| Operation | Revalidate |
|-----------|------------|
| Create | Parent collection + detail if applicable |
| Update | Parent collection + detail |
| Delete | Parent collection |
| Translation upsert | Detail + translations key |

```typescript
// Tag creation revalidates both list and detail
export const createTag = action(async (groupId: string, data) => {
  const result = await apiClient(...);
  revalidate("tag-groups");           // List
  revalidate(["tag-group-detail", groupId]); // Detail
  return result;
}, "create-tag");
```

### Rule 4: Component Usage

```typescript
// ✅ CORRECT - Use useAction with imported action
export function MyComponent() {
  const createTrigger = useAction(createTag);
  const submission = useSubmission(createTag);
  
  const handleSubmit = () => {
    createTrigger(groupId, formData);
  };
}

// ❌ WRONG - Redundant local wrapper
export function MyComponent() {
  const createTagAction = action(async (data) => {
    "use server";
    return await createTag(data);  // Already an action!
  }, "local-wrapper");
  
  const createTrigger = useAction(createTagAction);
}
```

### Rule 5: Index File Exports

```typescript
// ✅ CORRECT - Export from both .api.ts and .actions.ts
// src/lib/api/endpoints/tags/index.ts
export * from "./tags.types";
export * from "./tags.api";       // queries
export * from "./tags.actions";    // mutations
```

### Rule 6: Cache Key Naming Convention

| Resource | List Key | Detail Key | Translations Key |
|----------|----------|------------|-------------------|
| Tags | `tags-by-group` | `tag-detail` | `tag-translations` |
| Tag Groups | `tag-groups` | `tag-group-detail` | `tag-group-translations` |
| Categories | `category-tree` | `category-detail` | `category-translations` |

---

## Common Pitfalls to Avoid

1. **Missing `query` wrapper** - Translation fetch functions must use `query`
2. **Redundant action wrappers** - Don't wrap an action in another action
3. **Wrong import path** - Mutations come from `.actions.ts`, not `.api.ts`
4. **Forgetting revalidation** - Always call `revalidate()` after mutations
5. **Inconsistent cache keys** - Use consistent naming across the codebase

## File Structure Convention

```
src/lib/api/endpoints/
├── tags/
│   ├── tags.api.ts          # READ: query functions (getTagsByGroup, getTagDetail)
│   ├── tags.actions.ts      # WRITE: action functions (createTag, updateTag, deleteTag)
│   └── tags.types.ts
├── tag-groups/
│   ├── tag-groups.api.ts    # READ: query functions
│   ├── tag-groups.actions.ts # WRITE: action functions
│   └── tag-groups.types.ts
└── categories/
    ├── categories.api.ts    # READ: query functions
    ├── categories.actions.ts # WRITE: action functions
    └── categories.types.ts
```

## Migration Steps

### Phase 1: Identify Current Mutations

| File | Current Function | Should Become |
|------|------------------|---------------|
| `tags.api.ts` | `createTag` | Move to `tags.actions.ts` |
| `tags.api.ts` | `updateTag` | Move to `tags.actions.ts` |
| `tags.api.ts` | `deleteTag` | Move to `tags.actions.ts` |
| `tags.api.ts` | `upsertTagTranslation` | Move to `tags.actions.ts` |
| `tags.api.ts` | `deleteTagTranslation` | Move to `tags.actions.ts` |
| `tag-groups.api.ts` | `createTagGroup` | Move to `tag-groups.actions.ts` |
| `tag-groups.api.ts` | `updateTagGroup` | Move to `tag-groups.actions.ts` |
| `tag-groups.api.ts` | `deleteTagGroup` | Move to `tag-groups.actions.ts` |
| `tag-groups.api.ts` | `upsertTagGroupTranslation` | Move to `tag-groups.actions.ts` |
| `tag-groups.api.ts` | `deleteTagGroupTranslation` | Move to `tag-groups.actions.ts` |
| `categories.api.ts` | `createCategory` | Move to `categories.actions.ts` |
| `categories.api.ts` | `updateCategory` | Move to `categories.actions.ts` |
| `categories.api.ts` | `deleteCategory` | Move to `categories.actions.ts` |
| `categories.api.ts` | `upsertCategoryTranslation` | Move to `categories.actions.ts` |
| `categories.api.ts` | `deleteCategoryTranslation` | Move to `categories.actions.ts` |

### Phase 2: Create Action Files

Create `.actions.ts` files with `action` wrappers:
```typescript
// src/lib/api/endpoints/tags/tags.actions.ts
"use action";
import { action, revalidate } from "@solidjs/router";
import { apiClient } from "../../api-client";
import type { CreateTagDto, UpdateTagDto } from "./tags.types";

export const createTag = action(async (groupId: string, data: CreateTagDto) => {
  const result = await apiClient(`/admin/tag-groups/${groupId}/tags`, {
    method: "POST",
    body: JSON.stringify(data),
  });
  revalidate("tag-groups");
  revalidate(["tag-group-detail", groupId]);
  return result;
}, "create-tag");
```

### Phase 3: Update Import Paths

Update all files importing from `.api.ts` to import mutations from `.actions.ts`.

### Phase 4: Update Usage in Components

Change from:
```typescript
const handleSubmit = async () => {
  await createTag(groupId, formData);
};
```

To:
```typescript
const [result, createTagAction] = createTag();
const handleSubmit = async () => {
  await createTagAction(groupId, formData);
};
```

Or use `useAction` for forms:
```typescript
const action = useAction(createTag);
```

## Benefits

1. **Consistent pattern** - Clear separation of READ vs WRITE operations
2. **Better caching** - `action` provides built-in cache invalidation
3. **Form integration** - Works with `useAction` and `useForm` for better UX
4. **Server-side handling** - Can leverage server actions pattern
5. **Type safety** - Better inference with SolidJS router types

## References

- [SolidJS Router - Actions](https://docs.solidjs.com/solid-router/reference/actions)
- [SolidJS Router - Queries](https://docs.solidjs.com/solid-router/reference/data-functions#query)
