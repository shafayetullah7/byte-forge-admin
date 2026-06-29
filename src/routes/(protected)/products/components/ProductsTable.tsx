import { A } from "@solidjs/router";
import { For, Show } from "solid-js";
import { Badge } from "~/components/ui/Badge";
import type { AdminProductSummary, ProductStatus } from "~/lib/api/endpoints/products";

const statusVariant: Record<ProductStatus, "success" | "warning" | "danger" | "neutral"> = {
  ACTIVE: "success",
  DRAFT: "warning",
  ARCHIVED: "danger",
};

const formatCurrency = (value: string | null) =>
  value ? `৳ ${Number(value).toLocaleString()}` : "—";

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

export interface ProductsTableProps {
  products: AdminProductSummary[];
  showShop?: boolean;
}

export function ProductsTable(props: ProductsTableProps) {
  return (
    <div class="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="border-b border-slate-200 bg-slate-50">
            <tr class="text-left text-xs font-semibold uppercase text-slate-600">
              <th class="px-6 py-3">Product</th>
              <Show when={props.showShop !== false}>
                <th class="px-6 py-3">Shop</th>
              </Show>
              <th class="px-6 py-3 text-right">Price</th>
              <th class="px-6 py-3 text-center">Stock</th>
              <th class="px-6 py-3">Status</th>
              <th class="px-6 py-3">Updated</th>
              <th class="px-6 py-3" />
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <Show
              when={props.products.length > 0}
              fallback={
                <tr>
                  <td
                    colSpan={props.showShop === false ? 6 : 7}
                    class="px-6 py-12 text-center text-sm text-slate-500"
                  >
                    No products found.
                  </td>
                </tr>
              }
            >
              <For each={props.products}>
                {(product) => (
                  <tr class="hover:bg-slate-50">
                    <td class="px-6 py-4">
                      <div class="flex items-center gap-3">
                        <Show
                          when={product.thumbnailUrl}
                          fallback={
                            <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-xs text-slate-400">
                              —
                            </div>
                          }
                        >
                          <img
                            src={product.thumbnailUrl!}
                            alt=""
                            class="h-10 w-10 rounded-lg object-cover"
                          />
                        </Show>
                        <div>
                          <div class="font-medium text-slate-900">{product.name}</div>
                          <div class="text-xs text-slate-500">{product.slug}</div>
                        </div>
                      </div>
                    </td>
                    <Show when={props.showShop !== false}>
                      <td class="px-6 py-4">
                        <A
                          href={`/shops/${product.shop.id}`}
                          class="text-sm font-medium text-primary-green-700 hover:underline"
                        >
                          {product.shop.name}
                        </A>
                      </td>
                    </Show>
                    <td class="px-6 py-4 text-right text-sm font-medium text-slate-900">
                      {formatCurrency(product.price)}
                    </td>
                    <td class="px-6 py-4 text-center text-sm text-slate-700">
                      <Show
                        when={product.inventoryCount > 0}
                        fallback={<Badge variant="danger" size="sm">Out of stock</Badge>}
                      >
                        {product.inventoryCount}
                      </Show>
                    </td>
                    <td class="px-6 py-4">
                      <Badge variant={statusVariant[product.status]} size="sm">
                        {product.status}
                      </Badge>
                    </td>
                    <td class="px-6 py-4 text-sm text-slate-600">
                      {formatDate(product.updatedAt)}
                    </td>
                    <td class="px-6 py-4 text-right">
                      <A
                        href={`/products/${product.id}`}
                        class="text-sm font-medium text-primary-green-700 hover:underline"
                      >
                        View
                      </A>
                    </td>
                  </tr>
                )}
              </For>
            </Show>
          </tbody>
        </table>
      </div>
    </div>
  );
}
