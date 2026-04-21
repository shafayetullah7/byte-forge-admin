import { Badge } from "~/components/ui/Badge";
import { For } from "solid-js";

const mockTransactions = [
  { id: "TXN-001", type: "sale", amount: 4500, status: "completed", date: "2024-01-18" },
  { id: "TXN-002", type: "payout", amount: 3800, status: "completed", date: "2024-01-15" },
  { id: "TXN-003", type: "commission", amount: 450, status: "deducted", date: "2024-01-18" },
];

export function FinancialsTab() {
  return (
    <div class="space-y-6">
      <div class="grid grid-cols-3 gap-4">
        <div class="bg-white rounded-xl border border-slate-200 p-6">
          <p class="text-xs font-semibold text-slate-500 uppercase">Total Earnings</p>
          <p class="text-3xl font-bold text-slate-900 mt-2">৳ 4.5M</p>
          <p class="text-xs text-green-600 mt-1">+12% from last month</p>
        </div>
        <div class="bg-white rounded-xl border border-slate-200 p-6">
          <p class="text-xs font-semibold text-slate-500 uppercase">Pending Payouts</p>
          <p class="text-3xl font-bold text-amber-600 mt-2">৳ 1.2L</p>
          <p class="text-xs text-slate-500 mt-1">3 pending requests</p>
        </div>
        <div class="bg-white rounded-xl border border-slate-200 p-6">
          <p class="text-xs font-semibold text-slate-500 uppercase">Commission Rate</p>
          <p class="text-3xl font-bold text-slate-900 mt-2">5%</p>
          <p class="text-xs text-slate-500 mt-1">Platform fee</p>
        </div>
      </div>

      <div class="bg-white rounded-xl border border-slate-200 p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-slate-900">Recent Transactions</h3>
          <select class="text-xs px-2 py-1 border border-slate-200 rounded bg-white">
            <option>Last 30 days</option>
            <option>Last 90 days</option>
          </select>
        </div>

        <div class="space-y-3">
          <For each={mockTransactions}>
            {(txn) => (
              <div class="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div class="flex items-center gap-3">
                  <div class={`p-2 rounded-lg ${txn.type === "sale" ? "bg-green-100" : txn.type === "payout" ? "bg-blue-100" : "bg-amber-100"}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class={txn.type === "sale" ? "text-green-600" : txn.type === "payout" ? "text-blue-600" : "text-amber-600"}>
                      {txn.type === "sale" && <><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></>}
                      {txn.type === "payout" && <><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></>}
                      {txn.type === "commission" && <><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></>}
                    </svg>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-slate-900">{txn.id}</p>
                    <p class="text-xs text-slate-500">{txn.type}</p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="text-sm font-medium text-slate-900">৳ {txn.amount}</p>
                  <Badge variant={txn.status === "completed" ? "success" : "neutral"} size="sm">{txn.status}</Badge>
                </div>
              </div>
            )}
          </For>
        </div>
      </div>
    </div>
  );
}