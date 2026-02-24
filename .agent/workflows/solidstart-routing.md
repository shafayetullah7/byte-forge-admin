---
description: ByteForge Admin SolidStart routing, layouts, and file naming conventions
---

# SolidStart Routing Standards

This document defines the specific file-based routing conventions for the ByteForge Admin project.

## 1. File Naming Convention (The "Unique Tab" Rule)

To improve developer experience and avoid hundreds of open tabs named `index.tsx`, we use uniquely named files for routes.

### ✅ DO: Unique Naming
Use parenthesized folder names for the page component file.
- `routes/categories/(categories).tsx` → resolves to `/categories`
- `routes/categories/[id]/([id]).tsx` → resolves to `/categories/:id`
- `routes/(protected)/(dashboard).tsx` → resolves to `/`

### ❌ DON'T: Generic Naming
Do not use `index.tsx` for internal page components unless it is required by specific layout logic.
- Avoid `routes/categories/index.tsx`
- Avoid `routes/categories/[id]/index.tsx`

---

## 2. Route Groups & Layouts

### Route Groups `(groupName)`
Folders in parentheses `()` are ignored by the URL but can be used for:
1. **Logical grouping**: (protected), (auth).
2. **Shared layouts**: A layout for a group is named `(groupName).tsx` and placed next to the group folder.

### Layout Files
A file with the same name as its sister folder acts as the layout for all routes inside that folder.
- `routes/(protected).tsx` is the layout for all routes inside `routes/(protected)/`.

---

## 3. Dynamic Parameters

Use folder-style for dynamic routes to allow sibling nesting.
- **Convention**: `src/routes/path/[id]/([id]).tsx`
- Access via `useParams<{ id: string }>()`.

---

## 4. Preloading & Data

- **Preload**: Always export a `route` object with a `preload` function for pages that fetch data.
- **Async**: Use `createAsync` to consume the preloaded data.
- **Actions**: Use `action` for state-changing operations (POST, PATCH, DELETE).
