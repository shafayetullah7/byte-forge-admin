import { For } from "solid-js";

const stats = [
  { label: "Total Products", value: "156", icon: "inventory_2", color: "blue" },
  { label: "Total Orders", value: "1,247", icon: "shopping_cart", color: "green" },
  { label: "Revenue", value: "৳ 4.5M", icon: "payments", color: "purple" },
  { label: "Avg Rating", value: "4.8", icon: "star", color: "amber", suffix: "/5" },
  { label: "Page Views", value: "23.5K", icon: "visibility", color: "slate" },
  { label: "Conversion Rate", value: "3.2%", icon: "trending_up", color: "emerald" },
];

const iconPaths: Record<string, string> = {
  inventory_2: `<path d="M20 7h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v3H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zM10 4h4v3h-4V4z"></path>`,
  shopping_cart: `<circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>`,
  payments: `<rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line>`,
  star: `<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>`,
  visibility: `<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle>`,
  trending_up: `<polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline>`,
};

const colorClasses: Record<string, { bg: string; iconBg: string; iconColor: string }> = {
  blue: { bg: "bg-blue-50", iconBg: "bg-blue-100", iconColor: "text-blue-600" },
  green: { bg: "bg-green-50", iconBg: "bg-green-100", iconColor: "text-green-600" },
  purple: { bg: "bg-purple-50", iconBg: "bg-purple-100", iconColor: "text-purple-600" },
  amber: { bg: "bg-amber-50", iconBg: "bg-amber-100", iconColor: "text-amber-600" },
  slate: { bg: "bg-slate-50", iconBg: "bg-slate-100", iconColor: "text-slate-600" },
  emerald: { bg: "bg-emerald-50", iconBg: "bg-emerald-100", iconColor: "text-emerald-600" },
};

export function DashboardTab() {
  return (
    <div class="space-y-6">
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <For each={stats}>
          {(stat) => {
            const colors = colorClasses[stat.color];
            return (
              <div class={`rounded-xl p-4 ${colors.bg} border border-slate-200/50`}>
                <div class="flex items-center justify-between mb-3">
                  <div class={`p-2 rounded-lg ${colors.iconBg}`}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class={colors.iconColor}
                      innerHTML={iconPaths[stat.icon]}
                    />
                  </div>
                </div>
                <div class="text-2xl font-bold text-slate-900">
                  {stat.value}{stat.suffix}
                </div>
                <div class="text-xs text-slate-500 mt-1">{stat.label}</div>
              </div>
            );
          }}
        </For>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="bg-white rounded-xl border border-slate-200 p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-slate-900">Revenue Overview</h3>
            <select class="text-xs px-2 py-1 border border-slate-200 rounded bg-white">
              <option>Last 30 days</option>
              <option>Last 90 days</option>
            </select>
          </div>
          <div class="h-[200px] bg-slate-50 rounded-lg flex items-center justify-center">
            <span class="text-slate-400 text-sm">Chart placeholder</span>
          </div>
        </div>

        <div class="bg-white rounded-xl border border-slate-200 p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-slate-900">Order Trends</h3>
            <select class="text-xs px-2 py-1 border border-slate-200 rounded bg-white">
              <option>Last 30 days</option>
            </select>
          </div>
          <div class="h-[200px] bg-slate-50 rounded-lg flex items-center justify-center">
            <span class="text-slate-400 text-sm">Chart placeholder</span>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl border border-slate-200 p-6">
        <h3 class="text-lg font-semibold text-slate-900 mb-4">Quick Information</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label class="text-xs font-semibold text-slate-500 uppercase">Shop ID</label>
            <p class="text-sm text-slate-900 font-mono mt-1">550e8400-e29b...</p>
          </div>
          <div>
            <label class="text-xs font-semibold text-slate-500 uppercase">Owner</label>
            <p class="text-sm text-slate-900 mt-1">Md. Rahman</p>
          </div>
          <div>
            <label class="text-xs font-semibold text-slate-500 uppercase">Location</label>
            <p class="text-sm text-slate-900 mt-1">Dhaka, Bangladesh</p>
          </div>
          <div>
            <label class="text-xs font-semibold text-slate-500 uppercase">Category</label>
            <p class="text-sm text-slate-900 mt-1">Plant Nursery</p>
          </div>
        </div>
      </div>
    </div>
  );
}