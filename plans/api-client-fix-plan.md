# API Client Fix Plan

## Issues to Fix

### 1. Cookie Extraction Logic (Medium Priority)
**Problem:** `getCookieFromStr()` can't find cookies at the start of the string.

**Fix:**
```typescript
function getCookieFromStr(cookieStr: string, name: string): string | undefined {
  if (!cookieStr) return undefined;
  
  // Handle both cases: cookie at start and cookie in middle/end
  const regex = new RegExp(`(?:^|;\\s*)${name}=([^;]*)`);
  const match = cookieStr.match(regex);
  return match ? match[1] : undefined;
}
```

### 2. SSR Cookie Extraction (Medium Priority)
**Problem:** `getUniversalCookie()` doesn't extract cookie from SSR event.

**Fix:**
```typescript
function getUniversalCookie(name: string, headers?: Headers): string | undefined {
  // Browser: read from document.cookie
  if (typeof window !== "undefined") {
    return getCookieFromStr(document.cookie, name);
  }
  
  // SSR: Try headers first
  if (headers) {
    const cookieHeader = headers.get("cookie");
    if (cookieHeader) return getCookieFromStr(cookieHeader, name);
  }
  
  // SSR: Try to get from current request event
  if (import.meta.env.SSR) {
    try {
      const { getRequestEvent } = require("solid-js/web");
      const event = getRequestEvent();
      if (event) {
        const cookie = event.request.headers.get("cookie");
        if (cookie) return getCookieFromStr(cookie, name);
      }
    } catch (e) {
      // Ignore - not in SSR context
    }
  }
  
  return undefined;
}
```

### 3. Refresh Attempts Never Reset (High Priority)
**Problem:** `refreshAttempts` is never reset, so after one failed refresh, all future 401s fail without retry.

**Fix:**
```typescript
let refreshAttempts = 0;
const MAX_REFRESH_ATTEMPTS = 1;

// After successful token refresh
if (refreshResponse?.ok) {
  refreshAttempts = 0;  // RESET counter
  // ... proceed with retry
}

// After terminal auth failure (redirect to login)
if (!refreshResponse?.ok || !refreshPromise) {
  refreshAttempts = 0;  // RESET so next login can retry
  throw redirect("/login");
}
```

### 4. Client-Side Redirect (Medium Priority)
**Problem:** `throw redirect()` only works in SSR/server actions, not in regular client fetch.

**Fix:**
```typescript
} else {
  // Terminal Auth Failure: Universal Redirect
  // Reset for next time
  refreshAttempts = 0;
  
  // For server-side: use redirect
  if (import.meta.env.SSR) {
    const { redirect } = await import("@solidjs/router");
    throw redirect("/login");
  }
  
  // For client-side: navigate
  if (typeof window !== "undefined") {
    window.location.href = "/login";
    return {} as T;
  }
}
```

### 5. Vinxi Import Type Safety (Low Priority)
**Problem:** Using `any` for response headers.

**Fix:**
```typescript
// Proper type casting
const setCookies: string[] = [];
if (typeof (response.headers as any).getSetCookie === 'function') {
  setCookies = (response.headers as any).getSetCookie();
}
```

---

## Implementation Order

| Phase | Fix | Complexity |
|-------|-----|------------|
| 1 | Fix cookie extraction logic | Simple |
| 2 | Fix SSR cookie from event | Simple |
| 3 | Reset refreshAttempts on success/failure | Simple |
| 4 | Fix client-side redirect fallback | Medium |
| 5 | Fix type safety | Simple |

**Total: ~15 minutes**
