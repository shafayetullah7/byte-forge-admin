# ByteForge Admin - Fix Plan

## Overview
This document outlines a phased approach to fix the identified issues in the ByteForge Admin project.

---

## Phase 1: Quick Wins (15 minutes)

### 1.1 Fix Package Name
**File:** `package.json`  
**Change:** Rename from `example-with-tailwindcss` to `byte-forge-admin`

### 1.2 Update .gitignore
**File:** `.gitignore`  
**Change:** Update line 10 to `.env*` to catch all env file variants

### 1.3 Add Suspense Fallback
**File:** `src/app.tsx`  
**Change:** Add loading indicator component for Suspense fallback
```tsx
<Suspense fallback={<div class="min-h-screen flex items-center justify-center"><LoadingSpinner /></div>}>
  {props.children}
</Suspense>
```

### 1.4 Replace Hardcoded Loading
**File:** `src/routes/(protected).tsx`  
**Change:** Replace `"Loading..."` with proper spinner component

### 1.5 Make Sidebar Dynamic
**File:** `src/components/layout/AdminSidebar.tsx`  
**Changes:**
- Line 161: Remove hardcoded `v1.0.0` - read from package.json or remove
- Line 133: Remove hardcoded `3` - fetch from API or remove badge

---

## Phase 2: Code Improvements (35 minutes)

### 2.1 Fix API URL Fallback
**File:** `src/lib/api/api-client.ts`  
**Change:** Throw error if API URL is not configured in production
```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
  (import.meta.env.PROD 
    ? throw new Error("VITE_API_BASE_URL is required in production")
    : 'http://localhost:3005/api/v1');
```

### 2.2 Add Proper TypeScript Types
**Files:** 
- `src/routes/(protected).tsx` - Replace `any` with `ParentProps` or `JSX.Element`
- `src/routes/(auth)/login/(login).tsx` - Define proper error types instead of `any`

### 2.3 Fix Token Refresh Race Condition
**File:** `src/lib/api/api-client.ts`  
**Change:** Add try-catch around refresh and proper error propagation
```typescript
// Add retry limit
let refreshAttempts = 0;
const MAX_REFRESH_ATTEMPTS = 1;

// In 401 handler:
if (!isRefreshing && refreshAttempts < MAX_REFRESH_ATTEMPTS) {
  isRefreshing = true;
  refreshAttempts++;
  // ... refresh logic
}
```

---

## Phase 3: Dependency Update (10 minutes + testing)

### 3.1 Downgrade Zod
**File:** `package.json`  
**Change:** 
```json
"zod": "^3.23.0"
```

**Note:** After downgrade, verify schemas in:
- `src/schemas/login.schema.ts`
- `src/schemas/tag-group.schema.ts`

---

## Phase 4: Verification (Not in scope)

These items require testing after fixes are applied:
- [ ] Login flow works correctly
- [ ] Form validation works
- [ ] API calls succeed
- [ ] Auth token refresh works
- [ ] Build completes without errors

---

## Implementation Order

```
Phase 1 (Quick Wins)
├── 1.1 Fix Package Name
├── 1.2 Update .gitignore
├── 1.3 Add Suspense Fallback
├── 1.4 Replace Hardcoded Loading
└── 1.5 Make Sidebar Dynamic

Phase 2 (Code Improvements)
├── 2.1 Fix API URL Fallback
├── 2.2 Add Proper TypeScript Types
└── 2.3 Fix Token Refresh Race Condition

Phase 3 (Dependencies)
└── 3.1 Downgrade Zod
```

---

## Notes

- **Not Fixable Items:**
  - Server Actions vs Client Navigation mixing (SolidStart pattern)
  - If .env was already committed to git history (would need git history rewrite)

- **Estimated Total Time:** ~60 minutes
- **Risk Level:** Low (all changes are additive or refactoring)
