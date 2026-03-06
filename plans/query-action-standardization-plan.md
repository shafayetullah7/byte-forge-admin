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
