export type ProductStatus = "DRAFT" | "ACTIVE" | "ARCHIVED";

export type ProductType = "plant" | "pot" | "seed" | "fertilizer";

export interface AdminProductShop {
  id: string;
  slug: string;
  name: string;
  status: string;
}

export interface AdminProductSummary {
  id: string;
  slug: string;
  status: ProductStatus;
  productType: ProductType;
  name: string;
  thumbnailUrl: string | null;
  price: string | null;
  inventoryCount: number;
  createdAt: string;
  updatedAt: string;
  shop: AdminProductShop;
}

export interface AdminProductTranslation {
  name: string;
  shortDescription: string | null;
  description: string | null;
}

export interface AdminProductDetail extends AdminProductSummary {
  sku: string | null;
  shortDescription: string | null;
  description: string | null;
  translations: {
    en: AdminProductTranslation;
    bn: AdminProductTranslation;
  };
}

export interface AdminProductFilter {
  page?: number;
  limit?: number;
  shopId?: string;
  status?: ProductStatus;
  productType?: ProductType;
  search?: string;
  sortBy?: "createdAt" | "updatedAt" | "name" | "price";
  sortOrder?: "asc" | "desc";
}
