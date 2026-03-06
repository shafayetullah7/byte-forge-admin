# Tag Group Form Reimagination Plan

## Objective
Reimagine the Tag Group creation form with a better, purposeful layout and correct submission process following the login form pattern.

## Current Issues

### 1. Submission Process (Broken)
- Uses `document.getElementById()` + `requestSubmit()` workaround
- Tightly coupled FormHeader to form DOM ID
- Not following SolidJS/SolidStart conventions

### 2. Layout Issues
- FormHeader is overly complex with too many props
- The header/sidebar pattern doesn't match other forms
- Tags section is cluttered and hard to use

### 3. Code Quality
- Excessive use of `as any` type casting
- Inline styles mixed with Tailwind
- Hardcoded strings

## Reference: Login Form Pattern

From `src/routes/(auth)/login/(login).tsx`:

```tsx
// Simple handleSubmit
const handleSubmit = (values: LoginFormData) => {
    setErrorMessage(null);
    loginTrigger(values);
};

// Native Form with onSubmit
<Form onSubmit={handleSubmit}>
    {/* Fields */}
    <Button type="submit" isLoading={submission.pending}>
        Sign in
    </Button>
</Form>
```

## Proposed Solution

### Phase 1: Simplify FormHeader

**Current (Complex):**
```tsx
function FormHeader(props: {
    title: string;
    subtitle?: string;
    isSubmitting: boolean;
    onCancel: () => void;
    onSubmit: () => void;  // <-- Problem: expects callback
    submitLabel: string;
    backHref?: string;
    backLabel?: string;
})
```

**Proposed (Simplified):**
```tsx
function FormHeader(props: {
    title: string;
    subtitle?: string;
    backHref?: string;
    actions?: JSX.Element;  // <-- Flexible slot for buttons
})
```

### Phase 2: Proper Submission Flow

**Current:**
```tsx
// FormHeader button calls props.onSubmit
// which triggers requestSubmit() workaround
<Button onClick={props.onSubmit}>
// ...
<Form id="create-tag-group-form" onSubmit={handleSubmit}>
```

**Proposed (Login form pattern):**
```tsx
// Buttons inside the Form
<Form onSubmit={handleSubmit}>
    {/* Header without submit logic */}
    <FormHeader title="Create Tag Group" backHref="/tags" />
    
    {/* Fields */}
    
    {/* Submit button INSIDE the Form */}
    <div class="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => navigate("/tags")}>
            Cancel
        </Button>
        <Button type="submit" isLoading={submission.pending}>
            Create Group
        </Button>
    </div>
</Form>
```

### Phase 3: Better Layout

**Current Layout:**
```
+------------------------------------------+
|  Header (title, back, buttons)           |
+----------+-------------------------------+
| Metadata |  Tags Section                 |
| Column   |                               |
|          |                               |
| - Name   |  [Add Tag Inputs]             |
| - Slug   |  [Tag List]                   |
| - Desc   |                               |
| - Active |                               |
+----------+-------------------------------+
```

**Proposed Layout:**
```
+------------------------------------------+
|  Header: Create Tag Group                |
|  Back to Library                         |
+------------------------------------------+
|  +--------+  +--------+                 |
|  | Group  |  | Tags   |  <- Tabs       |
|  | Info   |  | List   |                 |
|  +--------+  +--------+                 |
+------------------------------------------+
|  [Form Fields]                           |
|                                          |
|  [Submit Buttons: Cancel | Create]       |
+------------------------------------------+
```

Or simpler - single column with collapsible sections:
```
+------------------------------------------+
|  Header: Create Tag Group                |
|  Back to Library                         |
+------------------------------------------+
|  Group Information                       |
|  +------------------------------------+  |
|  | Name (EN) | Name (BN) | Slug      |  |
|  | Description (EN)                  |  |
|  | Description (BN)                  |  |
|  | Active Toggle                     |  |
|  +------------------------------------+  |
+------------------------------------------+
|  Tags Management                         |
|  +------------------------------------+  |
|  | [Tag Input] [Slug] [Add]          |  |
|  | [Tag Chips Display]               |  |
|  +------------------------------------+  |
+------------------------------------------+
|  [Cancel]              [Create Group]    |
+------------------------------------------+
```

## Implementation Steps

### Step 1: Remove FormHeader complexity
- Simplify FormHeader to just render title, subtitle, back link
- Move buttons inside Form component

### Step 2: Fix submission
- Use `<Form onSubmit={handleSubmit}>`
- Use `<Button type="submit">` inside form
- Follow login form exactly for submission logic

### Step 3: Improve layout
- Use Card components for logical groupings
- Improve tags input/display
- Add proper spacing and visual hierarchy

### Step 4: Type safety
- Remove `as any` type casts
- Use proper TypeScript types

## Files to Modify

1. `src/components/taxonomy/TagGroupForm.tsx` - Main refactor

## Success Criteria

- [ ] Form uses native `<Form onSubmit={...}>` pattern
- [ ] Submit button uses `type="submit"` 
- [ ] No `document.getElementById()` or `requestSubmit()` 
- [ ] Layout is clean and purposeful
- [ ] Follows same pattern as login form
- [ ] Type-safe (no `as any`)
