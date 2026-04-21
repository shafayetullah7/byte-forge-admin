# Shop Details Page Implementation Plan

## Overview

A comprehensive shop management interface for admins with tabbed navigation for different sections. Each shop has extensive data including verification documents, owner info, contact details, address, business settings, products, orders, and financials.

---

## Architecture

### Route Structure
```
/shops/[shop_id]
  ├── (detail).tsx          - Layout wrapper with tabs
  ├── dashboard/            - Overview & stats
  ├── verification/         - Document review & approval
  ├── profile/              - Basic shop info
  ├── contact/              - Contact & social media
  ├── address/              - Location & map
  ├── products/             - Product management
  ├── orders/               - Order history
  ├── delivery/             - Shipping settings
  ├── owner/                - Owner profile
  ├── financials/           - Payouts & transactions
  ├── history/              - Activity log
  └── actions/              - Admin quick actions (suspend, delete, etc.)
```

### Component Structure
```
src/routes/(protected)/shops/[shop_id]/
  ├── (detail).tsx                    - Main layout with tab navigation
  ├── components/
  │   ├── ShopDetailHeader.tsx        - Shop name, status, quick actions
  │   ├── ShopTabNav.tsx              - Tab navigation component
  │   ├── DashboardTab.tsx            - Dashboard overview
  │   ├── VerificationTab.tsx         - Verification documents & actions
  │   ├── ProfileTab.tsx              - Shop profile info
  │   ├── ContactTab.tsx              - Contact & social
  │   ├── AddressTab.tsx              - Address & map
  │   ├── ProductsTab.tsx             - Products list
  │   ├── OrdersTab.tsx               - Orders list
  │   ├── DeliveryTab.tsx             - Delivery settings
  │   ├── OwnerTab.tsx                - Owner profile
  │   ├── FinancialsTab.tsx           - Financial data
  │   ├── HistoryTab.tsx              - Activity history
  │   └── ActionsTab.tsx              - Admin actions panel
  └── index.ts                        - Barrel export
```

---

## Tab Sections (Exhaustive)

### 1. Dashboard Tab
**Purpose:** Overview of shop performance and status

| Data Field | Source | Display |
|------------|--------|---------|
| Shop status | `shop.status` | Badge (color-coded) |
| Verification status | `verification.status` | Badge |
| Total products | Products API count | Number |
| Total orders | Orders API count | Number |
| Total revenue | Orders API sum | Currency |
| Average rating | Reviews API avg | Stars + number |
| Shop views | Analytics API | Number |
| Created date | `shop.createdAt` | Date |
| Last updated | `shop.updatedAt` | Date |

**Components:**
- `StatCard` - KPI metrics display
- `StatusBadges` - Shop & verification status
- `QuickActions` - Approve/Suspend buttons

---

### 2. Verification Tab (HIGH PRIORITY - Admin Workflow)
**Purpose:** Review verification documents and approve/reject

| Data Field | Source | Display |
|------------|--------|---------|
| Verification status | `shopVerification.status` | Badge |
| Trade license number | `shopVerification.tradeLicenseNumber` | Text |
| Trade license document | `mediaTable.url` | Image/PDF viewer |
| TIN number | `shopVerification.tinNumber` | Text |
| TIN document | `mediaTable.url` | Image/PDF viewer |
| Utility bill document | `mediaTable.url` | Image/PDF viewer |
| Verified at | `shopVerification.verifiedAt` | Date |
| Rejection reason | `shopVerification.rejectionReason` | Text (if rejected) |
| Admin notes | `shopVerification.adminNotes` | Text |

**Actions:**
- Approve shop
- Reject shop (with reason)
- Request more documents
- Add admin notes

**Components:**
- `DocumentViewer` - Image/PDF display
- `VerificationStatusBadge`
- `ApproveRejectActions`
- `AdminNotesForm`

---

### 3. Profile Tab
**Purpose:** Shop basic information and branding

| Data Field | Source | Display |
|------------|--------|---------|
| Shop name (EN) | `shopTranslations.name` | Text |
| Shop name (BN) | `shopTranslations.name` | Text (if exists) |
| Description (EN) | `shopTranslations.description` | Text |
| Description (BN) | `shopTranslations.description` | Text |
| Slug | `shop.slug` | Text |
| Logo | `mediaTable.url` | Image |
| Banner | `mediaTable.url` | Image |
| Primary color | `shop.primaryColor` | Color picker display |
| Secondary color | `shop.secondaryColor` | Color picker display |
| Accent color | `shop.accentColor` | Color picker display |
| Business hours | `shopBusiness.businessHours` | Text/Schedule display |

**Components:**
- `ShopLogoBanner`
- `ColorSwatches`
- `TranslationDisplay` (EN/BN)

---

### 4. Contact Tab
**Purpose:** Contact information and social media

| Data Field | Source | Display |
|------------|--------|---------|
| Business email | `shopContact.businessEmail` | Text + copy button |
| Phone | `shopContact.phone` | Text + call link |
| Alternative phone | `shopContact.alternativePhone` | Text |
| WhatsApp | `shopContact.whatsapp` | Link to WhatsApp |
| Telegram | `shopContact.telegram` | Link to Telegram |
| Facebook | `shopContact.facebook` | Link to profile |
| Instagram | `shopContact.instagram` | Link to profile |
| X/Twitter | `shopContact.x` | Link to profile |

**Components:**
- `ContactInfoCard`
- `SocialMediaLinks`

---

### 5. Address Tab
**Purpose:** Physical location and map

| Data Field | Source | Display |
|------------|--------|---------|
| Country | `shopAddressTranslations.country` | Text |
| Division | `shopAddressTranslations.division` | Text |
| District/City | `shopAddressTranslations.district` | Text |
| Street | `shopAddressTranslations.street` | Text |
| Postal code | `shopAddress.postalCode` | Text |
| Latitude | `shopAddress.latitude` | Number |
| Longitude | `shopAddress.longitude` | Number |
| Google Maps link | `shopAddress.googleMapsLink` | Link |
| Is verified | `shopAddress.isVerified` | Badge |

**Components:**
- `AddressDisplay`
- `MapEmbed` (Google Maps iframe or static map)
- `VerificationBadge`

---

### 6. Products Tab
**Purpose:** Product management and inventory

| Data | Source | Display |
|------|--------|---------|
| Product list | Products API | Table |
| Product categories | Categories API | Filter |
| Stock status | Product.stock | Badge |
| Active/Inactive | Product.status | Filter |
| Product images | Media API | Thumbnails |

**Components:**
- `ProductsTable`
- `ProductFilters`
- `ProductStatusBadge`

---

### 7. Orders Tab
**Purpose:** Order history and management

| Data | Source | Display |
|------|--------|---------|
| Order list | Orders API | Table |
| Order status | Order.status | Badge |
| Order total | Order.total | Currency |
| Customer | Order.customer | Link |
| Date | Order.createdAt | Date |

**Components:**
- `OrdersTable`
- `OrderStatusBadge`
- `OrderFilters` (by status, date range)

---

### 8. Delivery Tab
**Purpose:** Shipping and delivery settings

| Data Field | Source | Display |
|------------|--------|---------|
| Local delivery | `shopBusiness.localDelivery` | Toggle/Badge |
| Nationwide shipping | `shopBusiness.nationwideShipping` | Toggle/Badge |
| In-store pickup | `shopBusiness.inStorePickup` | Toggle/Badge |
| International shipping | `shopBusiness.internationalShipping` | Toggle/Badge |
| Delivery area description | `shopBusiness.deliveryAreaDescription` | Text |
| Min delivery time | `shopBusiness.minimumDeliveryTime` | Text |

**Components:**
- `DeliveryOptionsDisplay`
- `DeliveryAreaMap` (optional)

---

### 9. Owner Tab
**Purpose:** Owner profile and verification

| Data Field | Source | Display |
|------------|--------|---------|
| First name | `user.firstName` | Text |
| Last name | `user.lastName` | Text |
| Username | `user.userName` | Text |
| Email | `user.email` | Text |
| Avatar | `user.avatar` | Image |
| Email verified | `user.emailVerified` | Badge |
| Phone | `user.phone` (if exists) | Text |
| Account status | `user.isActive` | Badge |

**Components:**
- `OwnerProfileCard`
- `OwnerVerificationStatus`

---

### 10. Financials Tab
**Purpose:** Payouts, commissions, transactions

| Data | Source | Display |
|------|--------|---------|
| Total earnings | Transactions API | Currency |
| Pending payouts | Payouts API | Currency |
| Completed payouts | Payouts API | List |
| Commission rate | Config | Percentage |
| Transaction history | Transactions API | Table |

**Components:**
- `EarningsSummary`
- `PayoutsTable`
- `TransactionsTable`

---

### 11. History Tab
**Purpose:** Activity log and audit trail

| Data | Source | Display |
|------|--------|---------|
| Verification history | `shopVerificationHistory` | Timeline |
| Status changes | History API | Timeline |
| Admin actions | Admin log API | Timeline |
| Updates log | Audit API | Timeline |

**Components:**
- `ActivityTimeline`
- `HistoryFilters`

---

### 12. Actions Tab
**Purpose:** Admin quick actions panel

| Action | API Endpoint | Consequence |
|--------|--------------|-------------|
| Approve | `POST /admin/shops/:id/approve` | Status → APPROVED |
| Reject | `POST /admin/shops/:id/reject` | Status → REJECTED |
| Suspend | `POST /admin/shops/:id/suspend` | Status → SUSPENDED |
| Reactivate | `POST /admin/shops/:id/reactivate` | Status → ACTIVE |
| Delete | `DELETE /admin/shops/:id` | Status → DELETED |

**Components:**
- `ActionButtons`
- `ConfirmationModal`
- `ReasonInputForm` (for reject/suspend)

---

## API Endpoints Needed

### Backend (byte-forge-auth)

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/admin/shops/:id` | GET | Full shop details |
| `/admin/shops/:id/products` | GET | Shop products list |
| `/admin/shops/:id/orders` | GET | Shop orders list |
| `/admin/shops/:id/transactions` | GET | Financial data |
| `/admin/shops/:id/history` | GET | Activity history |
| `/admin/shops/:id/approve` | POST | Approve shop |
| `/admin/shops/:id/reject` | POST | Reject shop |
| `/admin/shops/:id/suspend` | POST | Suspend shop |
| `/admin/shops/:id/reactivate` | POST | Reactivate shop |
| `/admin/shops/:id` | DELETE | Delete shop |

### Frontend API Client

```typescript
// src/lib/api/endpoints/shops/shops.api.ts

export const getShopDetail = query(async (id: string) => {
  return apiClient<ShopDetail>(`/admin/shops/${id}`);
}, "shop-detail");

export const getShopProducts = query(async (id: string, params?: {...}) => {
  return apiClient(`/admin/shops/${id}/products`, { params });
}, "shop-products");

export const getShopOrders = query(async (id: string, params?: {...}) => {
  return apiClient(`/admin/shops/${id}/orders`, { params });
}, "shop-orders");

export const approveShop = async (id: string) => {
  return apiClient(`/admin/shops/${id}/approve`, { method: "POST" });
};

export const rejectShop = async (id: string, reason: string) => {
  return apiClient(`/admin/shops/${id}/reject`, { 
    method: "POST", 
    body: JSON.stringify({ reason }) 
  });
};

// ... more endpoints
```

---

## Implementation Order

### Phase 1: Foundation
1. Create route structure `[shop_id]/(detail).tsx`
2. Create `ShopDetailHeader.tsx` with status display
3. Create `ShopTabNav.tsx` navigation component
4. Update `getShopDetail` API to include all relations

### Phase 2: Core Tabs
1. Dashboard tab - stats overview
2. Verification tab - document review (highest priority)
3. Profile tab - basic info
4. Contact tab - contact details

### Phase 3: Secondary Tabs
1. Address tab - location
2. Owner tab - owner profile
3. Delivery tab - shipping settings
4. History tab - activity log

### Phase 4: Business Tabs
1. Products tab - product list
2. Orders tab - order history
3. Financials tab - financial data

### Phase 5: Actions
1. Actions tab - quick actions panel
2. Confirmation modals
3. Integration with all action endpoints

---

## UI/UX Considerations

### Tab Navigation
- Horizontal tabs below header
- Active tab highlighted
- Mobile: collapsible tabs or scrollable

### Quick Actions Bar
- Floating action buttons for approve/suspend
- Located in header or verification tab
- Confirmation dialogs before execution

### Document Viewer
- Modal or inline viewer for documents
- Zoom controls for images
- Download option for PDFs

### Responsive Design
- Mobile: stacked layout
- Tablet: 2-column layout for stats
- Desktop: full tab content

---

## File Structure After Implementation

```
byte-forge-admin/
├── src/
│   ├── routes/(protected)/shops/
│   │   ├── (shops).tsx                    # Shops list page
│   │   ├── [shop_id]/
│   │   │   ├── (detail).tsx               # Layout with tabs
│   │   │   ├── components/
│   │   │   │   ├── ShopDetailHeader.tsx
│   │   │   │   ├── ShopTabNav.tsx
│   │   │   │   ├── DashboardTab.tsx
│   │   │   │   ├── VerificationTab.tsx
│   │   │   │   ├── ProfileTab.tsx
│   │   │   │   ├── ContactTab.tsx
│   │   │   │   ├── AddressTab.tsx
│   │   │   │   ├── ProductsTab.tsx
│   │   │   │   ├── OrdersTab.tsx
│   │   │   │   ├── DeliveryTab.tsx
│   │   │   │   ├── OwnerTab.tsx
│   │   │   │   ├── FinancialsTab.tsx
│   │   │   │   ├── HistoryTab.tsx
│   │   │   │   ├── ActionsTab.tsx
│   │   │   │   ├── index.ts
│   │   │   └── dashboard/                 # Optional sub-routes
│   │   │   ├── verification/
│   │   │   ├── profile/
│   │   │   └── ... (other sub-routes)
│   ├── lib/api/endpoints/shops/
│   │   ├── shops.api.ts                   # Updated with all endpoints
│   │   ├── shops.types.ts                 # All type definitions
│   │   └── index.ts
│   ├── components/
│   │   ├── ui/
│   │   │   ├── DocumentViewer.tsx         # New component
│   │   │   ├── ActivityTimeline.tsx       # New component
│   │   │   ├── ColorSwatch.tsx            # New component
│   │   │   ├── MapEmbed.tsx               # New component

byte-forge-auth/
├── src/
│   ├── api/admin/admin-shop/
│   │   ├── admin-shop.controller.ts       # Updated endpoints
│   │   ├── admin-shop.service.ts          # Updated service methods
│   │   ├── dto/
│   │   │   ├── shop-detail.dto.ts         # New DTO
│   │   │   ├── approve-shop.dto.ts
│   │   │   ├── reject-shop.dto.ts
```

---

## Status Badges Color Mapping

### Shop Status
| Status | Color | Icon |
|--------|-------|------|
| DRAFT | neutral | edit |
| PENDING_VERIFICATION | warning | pending |
| APPROVED | success | check_circle |
| ACTIVE | success | check_circle |
| INACTIVE | neutral | pause |
| REJECTED | danger | cancel |
| SUSPENDED | danger | block |
| DELETED | danger | delete |

### Verification Status
| Status | Color | Icon |
|--------|-------|------|
| PENDING | neutral | pending |
| REVIEWING | warning | visibility |
| APPROVED | success | verified |
| REJECTED | danger | cancel |

---

## Next Steps

1. Start with Phase 1 - Foundation
2. Create route and navigation
3. Update backend API for full shop detail
4. Implement Verification tab (highest admin priority)
5. Progressive enhancement for other tabs