import { Badge } from "~/components/ui/Badge";
import { Button } from "~/components/ui/Button";
import { For, Show } from "solid-js";

const mockProducts = [
  { id: "1", name: "Monstera Deliciosa", price: 1200, stock: 25, status: "active", category: "Indoor Plants" },
  { id: "2", name: "Ficus Lyrata", price: 2500, stock: 8, status: "active", category: "Indoor Plants" },
  { id: "3", name: "Snake Plant", price: 450, stock: 45, status: "active", category: "Indoor Plants" },
  { id: "4", name: "Gardening Tool Set", price: 850, stock: 0, status: "inactive", category: "Tools" },
  { id: "5", name: "Organic Fertilizer", price: 350, stock: 120, status: "active", category: "Seeds & Fertilizers" },
];

export function ProductsTab() {
  return (
    <div class="space-y-6">
      <div class="bg-white rounded-xl border border-slate-200 p-4 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search products..."
            class="px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-green-500"
          />
          <select class="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white">
            <option>All Categories</option>
            <option>Indoor Plants</option>
            <option>Outdoor Plants</option>
            <option>Tools</option>
          </select>
          <select class="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white">
            <option>All Status</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>
        <div class="text-sm text-slate-500">
          Showing {mockProducts.length} products
        </div>
      </div>

      <div class="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-slate-50 border-b border-slate-200">
              <tr class="text-xs font-semibold text-slate-600 uppercase">
                <th class="px-6 py-3 text-left">Product</th>
                <th class="px-6 py-3 text-left">Category</th>
                <th class="px-6 py-3 text-right">Price</th>
                <th class="px-6 py-3 text-center">Stock</th>
                <th class="px-6 py-3 text-center">Status</th>
                <th class="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <For each={mockProducts}>
                {(product) => (
                  <tr class="hover:bg-slate-50">
                    <td class="px-6 py-4">
                      <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-slate-400">
                            <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                            <path d="M2 17l10 5 10-5"></path>
                            <path d="M2 12l10 5 10-5"></path>
                          </svg>
                        </div>
                        <span class="text-sm font-medium text-slate-900">{product.name}</span>
                      </div>
                    </td>
                    <td class="px-6 py-4 text-sm text-slate-600">{product.category}</td>
                    <td class="px-6 py-4 text-sm text-slate-900 text-right font-medium">৳ {product.price}</td>
                    <td class="px-6 py-4 text-center">
                      <Show when={product.stock > 0}>
                        <span class="text-sm text-slate-700">{product.stock}</span>
                      </Show>
                      <Show when={product.stock === 0}>
                        <Badge variant="danger" size="sm">Out of Stock</Badge>
                      </Show>
                    </td>
                    <td class="px-6 py-4 text-center">
                      <Badge variant={product.status === "active" ? "success" : "neutral"} size="sm">
                        {product.status}
                      </Badge>
                    </td>
                    <td class="px-6 py-4 text-right">
                      <Button variant="outline" size="sm">View</Button>
                    </td>
                  </tr>
                )}
              </For>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}