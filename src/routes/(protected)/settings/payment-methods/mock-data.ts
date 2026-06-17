export type PaymentMethodStatus = "ACTIVE" | "INACTIVE";

export interface PaymentMethod {
  id: string;
  key: string;
  displayName: string;
  logoUrl: string | null;
  status: PaymentMethodStatus;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export const MOCK_PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: "pm-001",
    key: "COD",
    displayName: "Cash on Delivery",
    logoUrl: null,
    status: "ACTIVE",
    description: "Pay when your order is delivered. No upfront payment required.",
    createdAt: "2026-01-10T08:00:00Z",
    updatedAt: "2026-05-01T12:00:00Z",
  },
  {
    id: "pm-002",
    key: "BKASH",
    displayName: "bKash",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/BKash_Logo_icon.svg/120px-BKash_Logo_icon.svg.png",
    status: "INACTIVE",
    description: "Mobile wallet payment via bKash. Gateway integration pending.",
    createdAt: "2026-02-15T10:30:00Z",
    updatedAt: "2026-04-20T09:15:00Z",
  },
  {
    id: "pm-003",
    key: "NAGAD",
    displayName: "Nagad",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Nagad_Logo.svg/120px-Nagad_Logo.svg.png",
    status: "INACTIVE",
    description: "Mobile wallet payment via Nagad. Gateway integration pending.",
    createdAt: "2026-02-15T10:35:00Z",
    updatedAt: "2026-04-20T09:15:00Z",
  },
  {
    id: "pm-004",
    key: "CARD",
    displayName: "Credit / Debit Card",
    logoUrl: null,
    status: "INACTIVE",
    description: "Visa, Mastercard, and local debit cards via payment gateway.",
    createdAt: "2026-03-01T14:00:00Z",
    updatedAt: "2026-03-01T14:00:00Z",
  },
  {
    id: "pm-005",
    key: "SSLCOMMERCE",
    displayName: "SSLCommerz",
    logoUrl: null,
    status: "INACTIVE",
    description: "Unified gateway for cards and mobile banking in Bangladesh.",
    createdAt: "2026-03-01T14:05:00Z",
    updatedAt: "2026-03-01T14:05:00Z",
  },
];
