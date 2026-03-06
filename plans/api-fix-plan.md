# API Fix Plan - Tag Groups & Tags

## Issues Identified

### 1. Type Safety - Excessive `any` Usage
| File | Line | Issue |
|------|------|-------|
| `tag-groups.api.ts` | 30 | `{ unwrapData: false } as any` |
| `tags.api.ts` | 32 | `{ unwrapData: false } as any` + `apiClient<any>` |

### 2. Missing `unwrapData` Option
- `FetchOptions` interface in `api-client.ts` doesn't include `unwrapData`
- Used to access full paginated response (including `meta`)

### 3. Missing Revalidation
| Function | Missing |
|----------|---------|
| `updateTag()` | `revalidate("tag-group-detail")` with group ID |
| `upsertTagGroupTranslation()` | Should invalidate detail |

### 4. Dead Code
- `src/lib/api/taxonomy.ts` is not used anywhere - can be deleted

---

## Fix Plan

### Phase 1: Add `unwrapData` Option (5 min)
**File:** `src/lib/api/api-client.ts`

Add `unwrapData` to `FetchOptions` interface:
```typescript
export interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
  strict?: boolean;
  responseType?: 'json' | 'blob' | 'text';
  unwrapData?: boolean;  // NEW
}
```

Update response handling to respect `unwrapData`:
```typescript
// In the response handling section
if (options.unwrapData === false) {
  return result as T;  // Return full response with meta
}
return result.data as T;  // Default behavior
```

### Phase 2: Fix Type Safety (10 min)

**File:** `tag-groups.api.ts`
```typescript
// Before
const result = await apiClient<PaginatedResponse<TagGroup>>(url, { unwrapData: false } as any);

// After
const result = await apiClient<PaginatedResponse<TagGroup>>(url, { unwrapData: false });
```

**File:** `tags.api.ts`
```typescript
// Before
const result = await apiClient<any>(url, { unwrapData: false } as any);

// After
const result = await apiClient<PaginatedResponse<Tag>>(url, { unwrapData: false });
```

### Phase 3: Fix Missing Revalidation (5 min)

**File:** `tags.api.ts` - `updateTag()` function
```typescript
// Add groupId param to revalidate correct cache
export const updateTag = async (id: string, data: UpdateTagDto, groupId?: string) => {
  const result = await apiClient<Tag>(`/admin/tags/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data)
  });
  revalidate("tag-groups");
  if (groupId) {
    revalidate(["tag-group-detail", groupId]);
  }
  return result;
};
```

**File:** `tag-groups.api.ts` - `upsertTagGroupTranslation()` function
```typescript
export async function upsertTagGroupTranslation(groupId: string, data: UpsertTagGroupTranslationDto): Promise<TagGroupTranslation> {
  const result = await apiClient<TagGroupTranslation>(`/admin/tag-groups/${groupId}/translations`, {
    method: "POST",
    body: JSON.stringify(data),
  });
  revalidate("tag-group-detail");  // ADD THIS
  return result;
}
```

### Phase 4: Delete Dead Code (1 min)
```bash
rm src/lib/api/taxonomy.ts
```

---

## Implementation Order

```
Phase 1 (5 min)
└── Add unwrapData to FetchOptions

Phase 2 (10 min)
├── Fix tag-groups.api.ts types
└── Fix tags.api.ts types

Phase 3 (5 min)
├── Fix updateTag revalidation
└── Fix upsertTagGroupTranslation revalidation

Phase 4 (1 min)
└── Delete taxonomy.ts
```

**Total Estimated Time:** ~21 minutes
