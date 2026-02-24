# Backlog: Category Commission Rate Strategy

## Narrative & Purpose
The Category Commission Rate is the primary revenue model for the ByteForge platform. It allows the platform to charge different service fees based on the product classification, balancing profitability with marketplace competitiveness.

## Key Principles

### 1. Revenue Segmentation
- **High Margin (15-20%)**: Fashion, Accessories, Decor.
- **Low Margin (5-8%)**: Electronics, Laptops, high-value technical hardware.

### 2. Hierarchical Inheritance
- Setting a rate at a **Root Category** (e.g., *Home & Garden*) automatically applies it to all descendants.
- This allows for "Management at Scale" across thousands of products without manual entry.

### 3. Precision Overrides
- Admins can manually override an inherited rate at any node in the tree.
- **Example**: *Laptops* can be set to 8% even if the parent *Computers* is at 10%.
- The tree logic should follow the "Nearest Defined Parent" rule.

### 4. Implementation Details
- **Backend**: Already supports `commissionRate` field in `categoriesTable`. Closure table logic allows for efficient depth-based inheritance queries.
- **Frontend**: The "Entity Hub" design at `/categories/[id]` includes toggles to visualize and switch between "Inherited" and "Overridden" states.

---
*Status: Planned / UI Skeleton Ready*
*Source: User Discussion 2026-02-24*
