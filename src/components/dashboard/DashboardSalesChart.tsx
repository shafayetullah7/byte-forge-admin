export function DashboardSalesChart() {
  return (
    <div class="flex min-h-[350px] flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div class="mb-6 flex items-center justify-between">
        <h2 class="text-base font-semibold text-slate-900">Sales trend</h2>
      </div>

      <div class="flex flex-1 items-center justify-center rounded-lg border-2 border-dashed border-slate-100 bg-slate-50">
        <div class="max-w-sm px-6 text-center">
          <p class="text-sm font-medium text-slate-500">Available in Phase 4</p>
          <p class="mt-2 text-xs leading-relaxed text-slate-400">
            Revenue charts and time-series analytics are deferred until the growth phase. Order
            totals are available on the Orders page.
          </p>
        </div>
      </div>
    </div>
  );
}
