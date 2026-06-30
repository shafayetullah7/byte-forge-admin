import type { Component } from "solid-js";
import {
  ArrowTrendingUpIcon,
  ChartPieIcon,
  ClipboardDocumentListIcon,
  DashboardIcon,
  DocumentIcon,
  FolderIcon,
  InventoryIcon,
  PaymentsIcon,
  SettingsIcon,
  ShoppingCartIcon,
  StorefrontIcon,
  UsersIcon,
  VerifiedUserIcon,
} from "~/components/icons";

export type NavItem = {
  label: string;
  href: string;
  icon: Component<{ class?: string }>;
  match?: "exact" | "prefix";
  enabled?: boolean;
  badge?: number;
};

export type NavSection = {
  title: string;
  items: NavItem[];
};

export const adminNavSections: NavSection[] = [
  {
    title: "Main Menu",
    items: [
      { label: "Overview", href: "/", icon: DashboardIcon, match: "exact", enabled: true },
      { label: "Shops", href: "/shops", icon: StorefrontIcon, match: "prefix", enabled: true },
      { label: "Vendors", href: "/vendors", icon: StorefrontIcon, match: "prefix", enabled: false },
      { label: "Products", href: "/products", icon: InventoryIcon, match: "prefix", enabled: true },
      { label: "Tag Library", href: "/tags", icon: ClipboardDocumentListIcon, match: "prefix", enabled: true },
      { label: "Categories", href: "/categories", icon: FolderIcon, match: "prefix", enabled: true },
      { label: "Orders", href: "/orders", icon: ShoppingCartIcon, match: "prefix", enabled: true },
      { label: "Transactions", href: "/transactions", icon: PaymentsIcon, match: "prefix", enabled: false },
    ],
  },
  {
    title: "Management",
    items: [
      { label: "Customers", href: "/customers", icon: UsersIcon, match: "prefix", enabled: true },
      { label: "Approvals", href: "/approvals", icon: VerifiedUserIcon, match: "prefix", enabled: false },
      { label: "Reviews", href: "/reviews", icon: ClipboardDocumentListIcon, match: "prefix", enabled: true },
      { label: "Campaigns", href: "/campaigns", icon: ArrowTrendingUpIcon, match: "prefix", enabled: true },
      { label: "Articles", href: "/articles", icon: DocumentIcon, match: "prefix", enabled: true },
      { label: "Reports", href: "/reports", icon: ChartPieIcon, match: "prefix", enabled: false },
    ],
  },
  {
    title: "System",
    items: [
      {
        label: "Languages",
        href: "/languages",
        icon: SettingsIcon,
        match: "prefix",
        enabled: true,
      },
      {
        label: "Payment Methods",
        href: "/payment-methods",
        icon: PaymentsIcon,
        match: "prefix",
        enabled: true,
      },
    ],
  },
];
