---
description: ByteForge Admin "Pro Light" design rules and visual standards
---

# ByteForge Admin Component Design Guide

> **Theme**: "Pro Light" — Data-dense, clean, high-productivity interface.
> **Audience**: ByteForge administrators and internal staff.
> **Device**: Desktop-first, responsive for tablet.
> **Color Rules**: Standard "Pro Light" theme focusing on legible data tables. Usage of `slate` grays, white backgrounds, and `primary-green` highlights.

This document serves as the standard design guide to ensure absolute coherency across all admin system components.

---

## 1. Visual Language & Color Palette
Use these CSS variables for all styling. Do NOT use ad-hoc hex codes.
- **Primary Action**: Built around the `primary-green` scale (Base `#1F6F4A`).
  - `var(--color-primary-green-700)`: The default base layer for primary buttons.
  - `var(--color-primary-green-800)`: Button hover states.
  - `var(--color-primary-green-500)`: Interactive focus rings (Inputs, Buttons).
  - `var(--color-primary-green-100)`: Active navigation/sidebar background.
  - `var(--color-primary-green-50)`: Extremely soft backgrounds (Login page, subtle alerts).
- **Background**: `var(--color-slate-50)` - Main workspace background.
- **Surface**: `var(--color-white)` - Cards, containers, modals, inputs.
- **Sidebar**: `var(--color-primary-green-950)` - Navigation background.
- **Border**: `var(--color-slate-200)` - Default borders for separation.
- **Text Main**: `var(--color-slate-900)` - Primary text, headings.
- **Text Muted**: `var(--color-slate-500)` - Secondary info, captions, disabled text.

---

## 2. Typography Standard

### Font: Inter (Google Fonts)
The admin panel uses `Inter` for maximum legibility in data-heavy environments.

### Scale & Usage
| Element | Utility Classes | Weight | Color | Usage Context |
|---|---|---|---|---|
| Page Title (h1) | `text-2xl` | `font-bold` (700) | `text-slate-900` | Top-level page headers. |
| Section Title (h2) | `text-xl` or `text-lg`| `font-semibold` (600) | `text-slate-800` | Section headers, modal titles. |
| Card Title (h3) | `text-base` | `font-semibold` (600) | `text-slate-900` | Titles inside metric cards or tables. |
| Body Main | `text-sm` | `font-normal` (400) | `text-slate-800` | Default text, table data. |
| Label | `text-sm` | `font-medium` (500) | `text-slate-700` | Form labels, table headers. |
| Detail / Hint | `text-xs` | `font-medium` (500) | `text-slate-500` | Small badges, captions, helper text. |

**Rules**:
- Small, crisp text with generous line-height (`leading-relaxed`).
- Max 3 font sizes per section to prevent visual clutter.
- Do not use ALL CAPS for continuous text; limit it to tiny badges or table headers (`uppercase tracking-widest`).

---

## 3. Shape & Borders

| Element | Border Radius | Border Width / Color |
|---|---|---|
| Main Cards, Modals | `rounded-xl` | `border border-slate-200` |
| Form Inputs, Buttons | `rounded-lg` | `border border-slate-200` (Inputs) |
| Badges, Avatars | `rounded-full` | `outline outline-1 outline-color/20` |

**Rules**:
- Never use `rounded-none`.
- Interactive elements (buttons, inputs) get `rounded-lg`.
- Data containers (cards) get `rounded-xl`.

---

## 4. Spacing Philosophy (4px Grid)

Open space is required to prevent data from looking overwhelming.

### Internal Padding
| Element | Padding |
|---|---|
| Large Cards | `p-6` (24px) |
| Standard Cards/Panels | `p-5` (20px) |
| Modals | `p-6 sm:p-8` |
| Buttons (md) | `px-4 py-2` |
| Buttons (sm) | `px-3 py-1.5` |
| Inputs | `px-3 py-2` |
| Table Cells | `px-5 py-4` or `px-4 py-3` (dense) |

### External Spacing
| Context | Spacing |
|---|---|
| Page Sections | `space-y-8` |
| Card Grids | `gap-6` |
| Form Fields | `space-y-4` |
| Title → Content | `mb-6` |

---

## 5. Elevation & Shadows

Depth should be minimal. Use shadows exclusively to indicate interactivity or floating layers above the main z-index.

| Level | Shadow Utility | Usage Context |
|---|---|---|
| **Flat** | No shadow | Backgrounds, empty states. |
| **Resting** | `shadow-sm` | ALL default cards, form inputs, resting buttons. |
| **Hover / Active** | `shadow-md` | Hover states for cards/buttons, active dropdowns. |
| **Overlay** | `shadow-lg` or `shadow-xl` | Modals, sticky headers, slide-over panels. |

**Rules**:
- A card should ALWAYS have `bg-white`, `border-slate-200`, and `shadow-sm`.
- Do not use colored shadows.

---

## 6. Page Positioning & Layout Hierarchy

Every page in the admin panel follows a strict 3-part spatial architecture:

### A. The Shell (Persistent)
- **Sidebar**: Fixed on the left (`w-[240px]`). Background is `primary-green-950`.
- **Topbar**: Fixed or sticky at the top, holding user profile/search.

### B. The Page Header
Always placed at the top-left of the main scrollable area.
```tsx
<div class="flex items-center justify-between mb-8">
  <div>
    <h1 class="text-2xl font-bold text-slate-900">Page Title</h1>
    <p class="text-sm text-slate-500 mt-1">Optional subtitle</p>
  </div>
  <div class="flex gap-3">
     {/* Primary and Secondary Actions (Buttons) go here */}
  </div>
</div>
```

### C. The Grid Layout
Use CSS Grid to structure content areas.
- **Metric Grids**: `grid grid-cols-1 md:grid-cols-3 gap-6`
- **Dashboard Splits**: `grid grid-cols-1 lg:grid-cols-3 gap-6`. The main table takes `col-span-2`, the side-feed takes `col-span-1`.

---

## 7. Interactive States

| State | Treatment |
|---|---|
| **Hover (Buttons)** | Darken background (`hover:bg-primary-green-800`) or text color. |
| **Hover (Table Rows)** | Shift background slightly: `hover:bg-slate-50 transition-colors`. |
| **Focus** | Provide outline on inputs: `focus:ring-2 focus:ring-primary-green-500 focus:border-primary-green-500`. |
| **Disabled** | `opacity-50 cursor-not-allowed`. Remove hover effects. |

---

## 8. State Communication (Empty, Loading, Error)

### Empty States
Use a centered container (`py-12`) with a muted icon (`w-12 h-12 text-slate-300`), a helpful `text-base` title, and a `text-sm text-slate-500` description. ALWAYS include a CTA button (e.g., "Add First Product").

### Loading States
Do not use generic spinners for full page loads. Use skeleton loaders (`animate-pulse bg-slate-200`) mapped exactly to the shape of the content that is loading (e.g., skeleton table rows matching the padding of real rows).

### Badges / Status Indicators
Badges use `text-[11px]` or `text-xs`, uppercase, tracking-wide.
- **Success**: `bg-sage-50 text-sage-700 outline-sage-200`
- **Warning/Pending**: `bg-amber-50 text-amber-700 outline-amber-200`
- **Error/Rejected**: `bg-red-50 text-red-700 outline-red-200`

---

## 9. Forbidden Patterns (Dos and Don'ts)

### ❌ DON'T
- **No Dark Mode**: The Admin panel is a purely Light-themed interface. Avoid `dark:` classes entirely.
- **No Vibrant Borders**: Borders should always be `slate-200` or `slate-100`.
- **No Ad-Hoc hex**: Every single color must map to a pre-defined `--color-` variable.
- **No i18n**: Avoid localization logic inside admin core templates; use English keys directly.
- **No Floating Labels**: Form labels must always be top-aligned block elements for rapid scanning. 

### ✅ DO
- Always componentize. Never repeat `<button>` classes; use `<Button>`.
- Keep spacing consistent: use multiples of 4px.
- Follow the exact Color Palette limits for the brand.
