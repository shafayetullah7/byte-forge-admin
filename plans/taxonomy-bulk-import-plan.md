# Taxonomy bulk import — plan (categories & tags)

**Status:** Phase 1–2 complete (tags + categories). Phase 3 (export, upsert polish) pending.  
**Scope:** Admin panel (`byte-forge-admin`) + bulk import API (`byte-forge-auth`)  
**Audience:** Product, admin UX, backend implementers  

---

## 1. Problem

Admins need to load many categories and tag-library entries at once (initial catalog setup, migrations from spreadsheets, copying seed-like structures). Creating items one-by-one in the UI is slow. A JSON paste → preview → edit → save flow should match how data is already shaped in seeds and reduce errors.

**Non-goals (v1):**

- CSV upload (JSON only; CSV can be a later converter)
- Importing product–tag assignments (`plant_details_tags`) — taxonomy only
- Public/seller-facing import
- Automatic AI translation for missing BN fields

---

## 2. Goals

| Goal | Success metric |
|------|----------------|
| Fast initial taxonomy setup | Admin can load 50+ tags or 20+ categories in one session |
| Safe commits | No partial broken trees; dry-run before write |
| Fix before save | Preview is editable (parents, names, slugs, active) |
| Clear failures | Row-level errors with path, not a single 500 message |
| Reuse existing rules | Same validation as single create (depth, slug uniqueness, EN/BN for tags) |

---

## 3. Entry points (UX)

| Location | Action |
|----------|--------|
| `/categories` | Wire existing **Import** button → `/categories/import` |
| `/categories/import` | Category bulk import wizard |
| `/tags` | **Bulk import** button → `/tags/import` |
| `/tags/import` | Tag group + tags bulk import wizard |

Optional later: **Export** on categories list downloads current tree as JSON (symmetry with import).

---

## 4. User flow (shared wizard)

All bulk import screens follow the same **four-step** pattern so admins learn it once.

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ 1. Paste    │ →  │ 2. Preview  │ →  │ 3. Review   │ →  │ 4. Result   │
│    JSON     │    │    & edit   │    │    & save   │    │    report   │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

### Step 1 — Paste JSON

**UI:**

- Page title: “Import categories” / “Import tag library”
- Short explanation: what will and will not happen (create taxonomy rows only)
- Large monospace textarea (min-height ~320px)
- Actions:
  - **Load example** — fills textarea with valid sample JSON
  - **Clear**
  - **Continue to preview** (primary) — disabled until JSON parses
- Collapsible **Format reference** (schema + one minimal example)
- Optional: drag-and-drop `.json` file onto textarea

**UX details:**

- Do **not** auto-advance on paste; explicit “Continue” avoids surprise navigation on half-finished paste
- Persist textarea + parsed preview in `sessionStorage` keyed by route so refresh on step 2 doesn’t lose work
- Character/size guard: warn if payload &gt; ~500KB or &gt; 500 nodes (“Consider splitting the import”)

**Parse errors (inline, above textarea):**

| Error | Message pattern |
|-------|-----------------|
| Invalid JSON | “Invalid JSON at line X, column Y: …” |
| Empty array | “Add at least one category / one tag group” |
| Wrong root shape | “Expected `{ items: [...] }` for categories” |

### Step 2 — Preview & edit

Transform parsed JSON into a **normalized in-memory model** with stable client refs (`_ref`) for nodes created in the same batch.

**Categories preview:**

- Tree table (indent by depth), similar to `CategoryTreeView`
- Columns: Status icon, EN name, BN name, slug, parent path, active, depth (1–3)
- Row actions: expand/collapse, edit inline (modal or row expand)
- Parent picker: `CategorySelector` — existing DB categories + nodes from this import (by slug or `_ref`)
- Bulk toggles: “Set all active”, “Auto-fill missing slugs from EN name”
- Filter: show only errors / warnings

**Tags preview:**

- Accordion per tag group (slug, EN/BN group name, active)
- Table of tags inside each group
- Columns: status, EN, BN, slug, active
- Move tag to another group (dropdown of groups in batch + existing groups loaded once)
- Add empty group / add tag row in UI (without re-pasting JSON)

**Status badges per row:**

| Badge | Meaning |
|-------|---------|
| Ready | Passes validation, will create |
| Warning | Valid but noteworthy (e.g. BN missing on category — allowed) |
| Error | Blocks save until fixed |
| Skip | Duplicate slug + policy `skip` |
| Exists | Slug already in DB (policy-dependent) |

**Sticky footer:**

- Counts: “12 ready · 2 warnings · 1 error”
- **Back** | **Continue to review** (disabled if any **Error**)

### Step 3 — Review & save

**UI:**

- Duplicate handling (radio, chosen once per session):
  - **Skip duplicates** (default) — safe for re-runs
  - **Fail on duplicate** — strict setup
  - **Upsert** (v2) — update names/translations; never delete
- Summary card:
  - Will create: N categories / M groups / K tags
  - Will skip: …
  - Will attach under existing parent: …
- **Dry run** (default first action) — calls API with `dryRun: true`
- After dry-run success, enable **Import now** (destructive styling muted; confirm checkbox: “I reviewed the preview”)

**During save:**

- Full-page or modal progress: “Importing… (transaction)”
- Disable navigation away; `beforeunload` warning if in flight

### Step 4 — Result report

- Summary: created / skipped / failed
- Downloadable log (JSON or CSV): `{ slug, status, id?, message? }[]`
- Actions:
  - **View categories** / **View tag library**
  - **Import more** (reset wizard, keep format reference open)
- Partial failure should **not** happen if backend uses one transaction (all-or-nothing); if it does, show rollback message clearly

---

## 5. JSON formats

### 5.1 Categories (nested — primary)

Matches `category.seed.ts` mental model.

```json
{
  "items": [
    {
      "slug": "indoor-plants",
      "isActive": true,
      "commissionRate": null,
      "translations": {
        "en": { "name": "Indoor Plants", "description": "Optional" },
        "bn": { "name": "ইনডোর উদ্ভিদ", "description": "ঐচ্ছিক" }
      },
      "children": [
        {
          "slug": "foliage-plants",
          "translations": {
            "en": { "name": "Foliage Plants" },
            "bn": { "name": "পাতার উদ্ভিদ" }
          }
        }
      ]
    }
  ]
}
```

**Also accept (normalized client-side):**

- `translations` as array: `[{ "locale": "en", "name": "..." }, ...]`
- Flat list with `parentSlug`:

```json
{
  "items": [
    { "slug": "indoor-plants", "parentSlug": null, "translations": { "en": { "name": "..." } } },
    { "slug": "foliage-plants", "parentSlug": "indoor-plants", "translations": { ... } }
  ]
}
```

Client builds tree from flat `parentSlug` before preview.

### 5.2 Tags (group-centric)

```json
{
  "groups": [
    {
      "slug": "light-requirement",
      "isActive": true,
      "translations": {
        "en": { "name": "Light requirement", "description": "" },
        "bn": { "name": "আলোর প্রয়োজনীয়তা", "description": "" }
      },
      "tags": [
        {
          "slug": "low-light",
          "isActive": true,
          "translations": {
            "en": { "name": "Low light" },
            "bn": { "name": "কম আলো" }
          }
        }
      ]
    }
  ]
}
```

**Also accept:** existing group reference for tags-only import:

```json
{
  "groups": [
    {
      "slug": "light-requirement",
      "existing": true,
      "tags": [ { "slug": "bright-indirect", "translations": { ... } } ]
    }
  ]
}
```

Backend resolves `existing: true` by slug lookup; group row not recreated.

---

## 6. Validation rules

### 6.1 Shared

| Rule | Client | Server |
|------|--------|--------|
| Slug format (`SlugSchema`) | Yes | Yes |
| Duplicate slug within paste | Error | Error |
| Duplicate slug vs DB | Policy (`skip` / `error`) | Yes |
| `isActive` boolean if present | Coerce | Yes |
| Empty name (EN for categories; EN+BN for tags) | Error | Yes |

### 6.2 Categories

| Rule | Client | Server |
|------|--------|--------|
| Max depth 3 (root = level 1) | Yes | Yes |
| `parentSlug` / `parentId` exists (DB or batch) | Yes | Yes |
| No cycles in batch | Yes | Yes |
| BN translation | Warning if missing | Optional (match create DTO) |
| `commissionRate` 0–100 | If present | If present |

### 6.3 Tags

| Rule | Client | Server |
|------|--------|--------|
| EN + BN required per group and tag | Yes | Yes |
| Tag slug globally unique | Yes | Yes |
| Group slug unique | Yes | Yes |
| Tag `groupSlug` / parent group exists | Yes | Yes |
| Empty `tags: []` on new group | Warning | Allow (creates empty group) |

---

## 7. Edge cases & handling

### 7.1 Paste & parse

| Edge case | Handling |
|-----------|----------|
| Trailing commas, comments in JSON | Strict JSON only; show parse error (no JSON5 in v1) |
| UTF-8 Bengali | Required; textarea must be UTF-8 |
| Duplicate keys in JSON object | Last wins; warn in preview if detectable |
| `null` vs missing `children` | Treat as leaf |
| Numeric slugs / spaces in slug | Validation error with suggested `slugify(en.name)` |
| Extremely deep nesting (&gt;3) | Mark subtree errors; don’t silently truncate |
| `parentSlug` points to self | Error on row |
| `parentSlug` points to descendant (cycle) | Error on row |
| Parent in batch appears after child in flat list | Topological sort before preview |
| Parent only in DB, child in batch | Resolve `parentSlug` against DB slugs on preview |
| Parent only in batch, slug typo | Error: “Parent `foo` not found” |
| Import under existing category + new children | Allowed; parent `parentId` from DB lookup |
| Mix `parentId` (UUID) and `parentSlug` | Prefer `parentId` if both; warn if conflict |

### 7.2 Categories — hierarchy

| Edge case | Handling |
|-----------|----------|
| Would exceed 3 levels | Error on node: “Max depth is 3” |
| Move parent in preview to invalid depth | Disable invalid options in `CategorySelector` |
| Slug exists, `skip` policy | Badge “Skip”; not in create count |
| Slug exists, `error` policy | Block review step |
| Subtree import under wrong root | Editable in preview |
| `commissionRate` on child only | Allow; document in format reference |
| Inactive parent, active child | Allow; warn “Parent is inactive” |
| Delete from preview | Remove node + descendants from batch (not DB) |

### 7.3 Tags

| Edge case | Handling |
|-----------|----------|
| Tag slug exists in another group | Error (global uniqueness) |
| Group exists, tags new | `existing: true` or auto-detect on dry-run |
| Group new, duplicate group slug | Policy: skip whole group or error |
| Tag in wrong group in JSON | Editable via group dropdown in preview |
| Two groups same slug in one paste | Error |
| Two tags same slug in one paste | Error |
| Tag with EN but empty BN | Error (required) |
| Group with EN but empty BN | Error |
| Import tags only (no groups key) | Reject with format hint |
| `usageCount` on existing tag | Upsert v2 only; v1 create-only skips or errors |

### 7.4 Save & network

| Edge case | Handling |
|-----------|----------|
| Session expired mid-save | 401 → redirect login; restore draft from sessionStorage after login |
| Request timeout | “Import timed out — no changes committed” (if transactional) |
| Double-click Import | Disable button; idempotency via client lock |
| Navigate away during save | `beforeunload` warning |
| Dry-run then data changed in another tab | Re-run dry-run before import |
| Partial DB failure | Single transaction rollback; show generic failure + support id in logs |

### 7.5 UX confusion

| Edge case | Handling |
|-----------|----------|
| User expects CSV | Link to “JSON format” + future CSV note |
| User pastes export from another env | Duplicates → skip policy default |
| User confuses tag library vs product tags | Copy on step 1: “This does not tag products” |
| Large paste, slow preview | Debounce parse; show spinner; virtualize table if &gt;100 rows |

---

## 8. Backend API (auth)

### 8.1 Endpoints

```
POST /api/v1/admin/categories/bulk-import
POST /api/v1/admin/tag-groups/bulk-import
```

### 8.2 Request body

```typescript
{
  items?: CategoryImportNode[];      // categories
  groups?: TagGroupImportNode[];     // tags
  options: {
    dryRun: boolean;                 // default true when called from review step 1
    onDuplicate: 'skip' | 'error'; // v1; 'upsert' v2
  };
}
```

### 8.3 Response

```typescript
{
  dryRun: boolean;
  success: boolean;
  summary: {
    created: number;
    skipped: number;
    updated: number;  // v2
    errors: number;
  };
  results: Array<{
    ref: string;           // slug or client path e.g. "items[0].children[1]"
    entity: 'category' | 'tag_group' | 'tag';
    slug: string;
    status: 'created' | 'skipped' | 'updated' | 'error';
    id?: string;
    message?: string;
  }>;
}
```

### 8.4 Implementation notes

- **Categories:** one transaction; insert in breadth-first order; use `CategoryHierarchyRepository.insertNode` per node; reuse slug checks from `CreateCategoryCommand`
- **Tags:** reuse `TagRepository.createMany` + translation batch patterns from `CreateTagGroupCommand`
- **Dry-run:** run all validations + duplicate lookups; no writes
- **Auth:** existing admin guard only

---

## 9. Component structure (admin)

```
src/routes/(protected)/categories/import.tsx
src/routes/(protected)/tags/import.tsx
src/components/taxonomy/bulk-import/
  BulkImportWizard.tsx          # stepper shell
  JsonPasteStep.tsx
  ImportReviewStep.tsx
  ImportResultStep.tsx
  categories/
    CategoryImportPreview.tsx   # tree table + edit
    category-import.schema.ts   # Zod normalize + validate
    category-import.types.ts
  tags/
    TagImportPreview.tsx
    tag-import.schema.ts
src/lib/api/endpoints/categories/categories-bulk-import.actions.ts
src/lib/api/endpoints/tag-groups/tag-groups-bulk-import.actions.ts
```

Reuse: `CategorySelector`, `slugify`, `PageShell`, `FormHeader`, `TagMetricsPanel` (counts on review step).

---

## 10. Phased delivery

### Phase 1 — Tags (recommended first)

- [ ] JSON paste + Zod parse + preview table
- [ ] `POST admin/tag-groups/bulk-import` (create groups + tags, `skip`/`error`)
- [ ] Dry-run + result report
- [ ] Entry from `/tags`

**Rationale:** Backend already bulk-creates tags on group create; smaller surface than closure table.

### Phase 2 — Categories

- [ ] Nested + flat `parentSlug` normalization
- [ ] Tree preview + parent editing
- [ ] `POST admin/categories/bulk-import`
- [ ] Wire `/categories` Import button

### Phase 3 — Polish

- [ ] Export categories JSON
- [ ] `upsert` mode
- [ ] sessionStorage draft recovery UI
- [ ] Virtualized preview for large trees

---

## 11. Acceptance criteria

**Tags**

- [ ] Admin can paste sample JSON, see grouped preview, fix one BN typo, import successfully
- [ ] Duplicate tag slug in paste shows error before review
- [ ] Duplicate tag slug in DB with `skip` shows in summary, not created
- [ ] Dry-run returns same counts as real import (without writes)
- [ ] Failed validation shows row path `groups[0].tags[2].slug`

**Categories**

- [ ] Nested JSON renders correct depth badges (1–3)
- [ ] Fourth level shows error, blocks save
- [ ] Child can attach to existing DB parent via `parentSlug`
- [ ] Import 10-node tree is one transaction (all or nothing)
- [ ] sessionStorage restores preview after accidental refresh on step 2

**UX**

- [ ] No step auto-skips without explicit button click
- [ ] Every error state has a recovery action (edit row, back to paste, or fix JSON)
- [ ] Result page lists every slug with status

---

## 12. Open decisions (confirm before build)

1. **Default duplicate policy:** `skip` (recommended) vs `error`
2. **Categories BN:** required in import or warning-only (align with single-create UX)
3. **v1 create-only** vs include **upsert** for slug collisions
4. **Flat-only** vs **nested-only** for categories (plan: accept both, normalize to tree)
5. **Existing inactive categories** as parents: allow with warning?

---

## 13. References

- Category seed shape: `byte-forge-auth/src/_db/seeds/category.seed.ts`
- Tag seed: `byte-forge-auth/src/_db/seeds/tag.seed.ts`
- Create category: `create-category.command.ts` (depth ≤ 3, closure table)
- Create tag group + tags: `create-tag-group.command.ts`
- Admin placeholder: `categories/(categories).tsx` Import/Export button
- Tag group create UX: `tags/groups/create.tsx` (inline tag list pattern)
