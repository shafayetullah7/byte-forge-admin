import type { PaginatedResult } from "../../types";
import type { AdminOrderStats } from "../orders/orders.types";

export interface AdminUserSummary {
  id: string;
  firstName: string;
  lastName: string;
  userName: string;
  email: string | null;
  emailVerified: boolean;
  isActive: boolean;
  avatar: string | null;
  createdAt: string;
}

export interface AdminUserDetail extends AdminUserSummary {
  emailVerifiedAt: string | null;
  updatedAt: string;
  orderStats: AdminOrderStats;
}

export interface AdminUserFilter {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: "createdAt" | "name";
  sortOrder?: "asc" | "desc";
  buyersOnly?: boolean;
}

export type { PaginatedResult };
