export type OrderStatus =
  | "PENDING_PAYMENT"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "COMPLETED"
  | "CANCELLED"
  | "EXPIRED";

export type PaymentStatus =
  | "PENDING"
  | "PROCESSING"
  | "COMPLETED"
  | "FAILED"
  | "REFUNDED"
  | "PARTIALLY_REFUNDED";

export interface AdminOrderShop {
  id: string;
  slug: string | null;
  name: string | null;
  status: string | null;
}

export interface AdminOrderBuyer {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  userName: string | null;
}

export interface AdminOrderSummary {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethodKey: string;
  paymentMethodDisplayName: string | null;
  total: string;
  createdAt: string;
  shop: AdminOrderShop;
  buyer: AdminOrderBuyer;
  itemCount: number;
}

export interface AdminOrderAddress {
  recipientName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  state: string | null;
  postalCode: string | null;
  country: string;
  companyName: string | null;
  deliveryInstructions: string | null;
}

export interface AdminOrderItem {
  id: string;
  productId: string;
  variantId: string | null;
  productName: string;
  variantTitle: string | null;
  sku: string | null;
  quantity: number;
  unitPrice: string;
  subtotal: string;
  imageUrl: string | null;
}

export interface AdminOrderStatusHistory {
  id: string;
  fromStatus: OrderStatus | null;
  toStatus: OrderStatus;
  notes: string | null;
  createdAt: string;
  actor: string;
  actorLabel: string;
}

export interface AdminOrderShipment {
  id: string;
  trackingNumber: string | null;
  carrier: string | null;
  shippingMethod: string | null;
  status: string;
  shippedAt: string | null;
  deliveredAt: string | null;
  estimatedDelivery: string | null;
}

export interface AdminOrderDetail extends AdminOrderSummary {
  groupId: string;
  subtotal: string;
  shippingCost: string;
  tax: string;
  notes: string | null;
  cancelledAt: string | null;
  cancelledReason: string | null;
  buyerDeliveryConfirmedAt: string | null;
  updatedAt: string;
  address: AdminOrderAddress | null;
  items: AdminOrderItem[];
  statusHistory: AdminOrderStatusHistory[];
  shipment: AdminOrderShipment | null;
}

export interface AdminOrderStats {
  total: number;
  pending: number;
  processing: number;
  shipped: number;
  delivered: number;
  cancelled: number;
  revenue: string;
}

export interface AdminOrderFilter {
  page?: number;
  limit?: number;
  shopId?: string;
  userId?: string;
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: "createdAt" | "total";
  sortOrder?: "asc" | "desc";
}

export interface AdminOrderStatsFilter {
  shopId?: string;
  userId?: string;
}
