import { Badge } from "~/components/ui/Badge";

export function ProfileTab() {
  return (
    <div class="space-y-6">
      <div class="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div class="h-32 bg-gradient-to-r from-green-400 to-green-600 relative">
          <div class="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1416879595882-3373a4f5795d?w=1200')] bg-cover bg-center opacity-50"></div>
        </div>
        <div class="p-6 flex items-end gap-6 -mt-12 relative">
          <img
            src="https://images.unsplash.com/photo-1416879595882-3373a4f5795d?w=100&h=100&fit=crop"
            alt="Shop logo"
            class="w-24 h-24 rounded-xl object-cover border-4 border-white shadow-lg"
          />
          <div class="flex-1">
            <h2 class="text-xl font-bold text-slate-900">Green Garden Nursery</h2>
            <p class="text-sm text-slate-500">green-garden-nursery</p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-white rounded-xl border border-slate-200 p-6">
          <div class="flex items-center gap-2 mb-4">
            <span class="text-sm font-semibold text-slate-700">English</span>
            <Badge variant="neutral" size="sm">EN</Badge>
          </div>
          <div class="space-y-4">
            <div>
              <label class="text-xs font-semibold text-slate-500 uppercase">Shop Name</label>
              <p class="text-slate-900 mt-1">Green Garden Nursery</p>
            </div>
            <div>
              <label class="text-xs font-semibold text-slate-500 uppercase">Description</label>
              <p class="text-slate-700 mt-1">Your one-stop shop for all plants, gardening tools, and expert advice.</p>
            </div>
            <div>
              <label class="text-xs font-semibold text-slate-500 uppercase">Business Hours</label>
              <p class="text-slate-700 mt-1">Mon-Sat: 9AM-6PM, Sun: 10AM-4PM</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl border border-slate-200 p-6">
          <div class="flex items-center gap-2 mb-4">
            <span class="text-sm font-semibold text-slate-700">Bengali</span>
            <Badge variant="neutral" size="sm">BN</Badge>
          </div>
          <div class="space-y-4">
            <div>
              <label class="text-xs font-semibold text-slate-500 uppercase">Shop Name</label>
              <p class="text-slate-900 mt-1">গ্রিন গার্ডেন নার্সারি</p>
            </div>
            <div>
              <label class="text-xs font-semibold text-slate-500 uppercase">Description</label>
              <p class="text-slate-700 mt-1">সকল প্রকার গাছ, গার্ডেনিং টুল এবং বিশেষজ্ঞ পরামর্শের জন্য আমাদের দোকান।</p>
            </div>
            <div>
              <label class="text-xs font-semibold text-slate-500 uppercase">Business Hours</label>
              <p class="text-slate-700 mt-1">সোম-শনি: ৯AM-৬PM, রবি: ১০AM-৪PM</p>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl border border-slate-200 p-6">
        <h3 class="text-lg font-semibold text-slate-900 mb-4">Branding Colors</h3>
        <div class="flex items-center gap-6">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-lg bg-[#22c55e] border border-slate-200"></div>
            <div>
              <p class="text-sm font-medium text-slate-700">Primary</p>
              <p class="text-xs text-slate-500 font-mono">#22c55e</p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-lg bg-[#16a34a] border border-slate-200"></div>
            <div>
              <p class="text-sm font-medium text-slate-700">Secondary</p>
              <p class="text-xs text-slate-500 font-mono">#16a34a</p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-lg bg-[#fbbf24] border border-slate-200"></div>
            <div>
              <p class="text-sm font-medium text-slate-700">Accent</p>
              <p class="text-xs text-slate-500 font-mono">#fbbf24</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}