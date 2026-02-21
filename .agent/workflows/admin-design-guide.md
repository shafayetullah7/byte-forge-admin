---
description: ByteForge Admin "Pro Light" design rules and visual standards
---

# Admin Design Guide Rules

All UI development in `@byte-forge-admin` MUST follow these "Pro Light" standards to ensure a premium, consistent, and high-productivity experience.

## 1. Visual Language & Color Palette
Use these CSS variables for all styling. Do NOT use ad-hoc hex codes.
- **Primary**: `var(--color-indigo-600)` (#4f46e5) - Key actions/state.
- **Background**: `var(--color-slate-50)` (#f8fafc) - Main workspace.
- **Surface**: `var(--color-white)` (#ffffff) - Cards, inputs, modals.
- **Sidebar**: `var(--color-slate-950)` (#09090b) - Navigation background.
- **Border**: `var(--color-slate-200)` (#e2e8f0) - Subtle separation.
- **Text Main**: `var(--color-slate-900)` (#0f172a) - Primary content.
- **Text Muted**: `var(--color-slate-500)` (#64748b) - Secondary info.

## 2. Typography Standard
- **Primary Font**: `Inter` (must be loaded via Google Fonts or locally).
- **Scale**:
  - `Display`: 24px/700 (text-2xl font-bold) - Page titles.
  - `Heading`: 18px/600 (text-lg font-semibold) - Cards, sections.
  - `Body`: 14px/400 (text-sm font-normal) - Default text.
  - `Detail`: 12px/500 (text-xs font-medium) - Labels, table headers.
- **Philosophy**: Small, crisp text with generous line-height (`leading-relaxed`) for readability in data-heavy views.

## 3. Spacing Philosophy (4px Grid)
- **Base Unit**: `4px` (Tailwind `1` unit).
- **Standards**:
  - `p-6` (24px): Standard page and large card padding.
  - `p-4` (16px): Compact card and modal padding.
  - `gap-4`: Standard spacing between related elements.
  - `space-y-6`: Standard stack spacing between sections.
- **White Space**: Prioritize white space to prevent visual clutter in a dense admin environment.

## 4. Component Design Directions
- **Atomic Thinking**: Build reusable atoms (Button, Input, Badge) first.
- **Cards**: All data containers must be cards with `bg-white`, `border-slate-200`, `rounded-lg`, and `shadow-sm`.
- **Forms**: Use single-column layouts for simple forms, two-column for complex metadata. Labels must always be top-aligned.
- **Tables**: Use a "Clean Row" approach: 1px bottom border, no side borders, subtle hover state (`hover:bg-slate-50`).

## 5. Dos and Don'ts

### ✅ DO
- Use **Indigo-600** for primary CTAs only.
- Use **rounded-lg** (8px) for EVERY interactive/container element.
- Keep the **Sidebar fixed** and **Topbar sticky**.
- Use **Empty States** (icons + helpful text) when no data is available.
- Ensure **all icons** come from a single set (e.g., Lucide or Phosphor).

### ❌ DON'T
- **No Dark Mode**: Avoid `dark:` classes entirely.
- **No i18n**: Avoid localization logic; use English keys directly.
- **No Custom Shadows**: Stick to `shadow-sm` or `shadow-md`.
- **No Vibrant Borders**: Borders should always be `slate-200` or `slate-100`.
- **No "Greenery"**: This project is a professional tool; keep it neutral (Slate/Indigo).

## 6. Ensuring Consistency
1. **The Core CSS**: All project-wide design tokens must be defined in `src/app.css` as CSS variables.
2. **Atomic Wrapper**: Every UI element must be a component in `src/components/ui/`. Never style raw HTML elements like `<button>` directly in pages.
3. **Layout Utility**: Use the `AdminShell` component to wrap all routes to guarantee layout persistence.
4. **Tailwind Config**: Extend the Tailwind theme to use the custom variables, locking the color and spacing choices.
