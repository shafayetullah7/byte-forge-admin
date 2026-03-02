---
description: ByteForge Admin code quality, file sizing, naming conventions, and architecture standards
---

# ByteForge Admin Code Quality Standard

## 0. AI Assistant Strict Rules (CRITICAL)
- **No Unsolicited Refactoring:** Do NOT arbitrarily refactor, re-architect, or rewrite working code (e.g., swapping out working libraries, rewriting logic flows) unless explicitly instructed by the user. Fix the exact bug requested and touch nothing else.
- **Strict Typing:** Never use `any`, implicit types, or inline mapped objects globally. Always use the proper exported TypeScript interfaces or SolidJS inferred types.

## 1. File Sizing and Organization
- **Sweet Spot (100–300 lines):** Target size for components/modules.
- **Danger Zone (>500 lines):** Technical debt. Must be split into sub-components.
- **Feature Folders:** Group components, hooks, and types by domain inside `src/components/[domain]`.

## 2. Component Composition
### ✅ DO: Composition
Pass child elements to keep base components simple and flexible.

### ❌ DON'T: Prop Explosion
Avoid massive configuration props that force internal `if/else` logic.

## 3. Naming & Typing Standards

### Naming Conventions
- **Booleans:** Prefix with `is`, `has`, `should`, or `can`. (`isActive`, `hasError`, `canEdit`)
- **Event Props:** Prefix with `on` (`onClose`, `onSave`).
- **Event Handlers:** Prefix with `handle` (`handleClose`, `handleSave`).
- **Lists:** Use plural names (`users`, `tagGroups`).

### TypeScript Standards
- **Components:** Use `interface` for props.
- **Data/Unions:** Use `type` for complex unions.
- **Strictness:** No `any`. Use `unknown` or specific types where possible.

## 4. Form Input Field Standards

### 4.1 String / Text Length Constraints (REQUIRED)
Every `<input>`, `<textarea>`, or custom Input component that accepts free-text **must** have:

- **`maxLength`** — Always required. Derive the value from the backend DTO (`z.string().max(N)`). If no DTO max exists, use a sensible UI maximum (e.g. `255` for names, `1000` for descriptions).
- **`minLength`** — Required when the backend DTO has a `z.string().min(N)` constraint greater than 0 (i.e. mandatory fields).

```tsx
// ✅ CORRECT
<Input
  label="Group Name *"
  maxLength={255}
  minLength={1}
  value={name()}
/>

<textarea
  maxLength={1000}
  value={description()}
/>

// ❌ WRONG — no length constraints
<Input label="Group Name *" value={name()} />
```

### 4.2 Why This Rule Exists
- Prevents users from submitting values that will be rejected by the backend (avoiding avoidable API errors).
- Provides instant, native browser feedback before a network round trip.
- Keeps the UI honest about what the backend actually accepts.

### 4.3 Where to Find the Max/Min Values
Always derive constraints from the backend DTO first:
- `z.string().min(1).max(255)` → `minLength={1} maxLength={255}`
- `z.string().optional()` with no `.max()` → use `maxLength={1000}` for textareas, `maxLength={255}` for inputs

## 5. Directory Mapping (Architecture)
| Directory | Content Rule |
| :--- | :--- |
| `src/components/ui` | Dumb primitives only. No business logic, no API calls. |
| `src/components/[domain]` | Domain-specific components (e.g. `taxonomy`, `categories`). |
| `src/components/errors` | Error boundary components and fallback UIs only. |
| `src/components/layout` | Layout shell components (sidebar, navbar). |
| `src/lib/api` | Pure API logic. Returns data or throws ApiError, no UI. |
| `src/routes` | SolidStart file-based routes only. No complex UI logic here. |

## 6. Summary: High-Priority Do's and Don'ts

| Feature | ✅ DO | ❌ DON'T |
| :--- | :--- | :--- |
| **Inputs** | Always set `maxLength` (and `minLength` where relevant). | Leave text inputs unconstrained. |
| **Logic** | Keep functions pure and small. | Write functions that do multiple unrelated things. |
| **State** | Keep state local unless genuinely shared. | Lift state to global stores "just in case." |
| **CSS** | Use design system tokens (Tailwind config). | Hardcode hex or arbitrary pixel values. |
| **Files** | Name files exactly what they export. | Use generic names like `utils.ts` or `helpers.ts`. |
| **Errors** | Always wrap async data sections in `<SafeErrorBoundary>`. | Leave `createAsync` calls unprotected. |

## 7. Verification Checklist
Before finishing a task, Antigravity must check:
1. Is any file > 500 lines?
2. Are boolean variables correctly prefixed?
3. Do all free-text inputs have `maxLength` (and `minLength` where applicable)?
4. Are all `createAsync` data sections wrapped in `<SafeErrorBoundary>`?
5. Are all magic strings moved to a constant or enum?
