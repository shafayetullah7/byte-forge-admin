import { useParams } from "@solidjs/router";
import { For } from "solid-js";

const mockHistory = [
  { action: "Shop created", user: "System", date: "Jan 10, 2024", type: "create" },
  { action: "Submitted for verification", user: "Md. Rahman", date: "Jan 15, 2024", type: "submit" },
  { action: "Verification started", user: "Admin", date: "Jan 16, 2024", type: "review" },
  { action: "Documents uploaded", user: "Md. Rahman", date: "Jan 17, 2024", type: "upload" },
  { action: "Shop approved", user: "Admin", date: "Jan 20, 2024", type: "approve" },
  { action: "Shop activated", user: "System", date: "Jan 20, 2024", type: "activate" },
];

const typeColors: Record<string, { bg: string; dot: string }> = {
  create: { bg: "bg-slate-50", dot: "bg-slate-400" },
  submit: { bg: "bg-amber-50", dot: "bg-amber-400" },
  review: { bg: "bg-blue-50", dot: "bg-blue-400" },
  upload: { bg: "bg-purple-50", dot: "bg-purple-400" },
  approve: { bg: "bg-green-50", dot: "bg-green-400" },
  activate: { bg: "bg-green-50", dot: "bg-green-400" },
};

export default function HistoryRoute() {
  const params = useParams();
  const shopId = params.shop_id;

  return (
    <div class="space-y-6">
      <div class="bg-white rounded-xl border border-slate-200 p-4">
        <span class="text-sm text-slate-500">Shop ID: {shopId}</span>
      </div>

      <div class="bg-white rounded-xl border border-slate-200 p-6">
        <h3 class="text-lg font-semibold text-slate-900 mb-4">Activity Timeline</h3>
        
        <div class="relative">
          <div class="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-200"></div>
          
          <div class="space-y-4">
            <For each={mockHistory}>
              {(item) => {
                const colors = typeColors[item.type];
                return (
                  <div class="relative flex items-start gap-4 pl-10">
                    <div class={`absolute left-2.5 w-3 h-3 rounded-full ${colors.dot} border-2 border-white`}></div>
                    
                    <div class={`flex-1 p-4 rounded-lg ${colors.bg}`}>
                      <div class="flex items-center justify-between mb-1">
                        <p class="text-sm font-medium text-slate-900">{item.action}</p>
                        <span class="text-xs text-slate-500">{item.date}</span>
                      </div>
                      <p class="text-xs text-slate-600">by {item.user}</p>
                    </div>
                  </div>
                );
              }}
            </For>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl border border-slate-200 p-6">
        <h3 class="text-lg font-semibold text-slate-900 mb-4">Admin Actions</h3>
        <div class="space-y-3">
          <div class="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
            <div class="w-2 h-2 rounded-full bg-blue-400"></div>
            <div class="flex-1">
              <p class="text-sm text-slate-900">Admin reviewed documents</p>
              <p class="text-xs text-slate-500">Jan 16, 2024 at 2:15 PM</p>
            </div>
          </div>
          <div class="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
            <div class="w-2 h-2 rounded-full bg-green-400"></div>
            <div class="flex-1">
              <p class="text-sm text-slate-900">Admin approved shop</p>
              <p class="text-xs text-slate-500">Jan 20, 2024 at 11:30 AM</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
