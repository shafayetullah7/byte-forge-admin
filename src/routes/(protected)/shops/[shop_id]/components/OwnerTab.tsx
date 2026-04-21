import { Badge } from "~/components/ui/Badge";

export function OwnerTab() {
  return (
    <div class="space-y-6">
      <div class="bg-white rounded-xl border border-slate-200 p-6">
        <div class="flex items-start gap-6">
          <div class="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-2xl font-bold">
            MR
          </div>

          <div class="flex-1">
            <div class="flex items-center gap-3 mb-2">
              <h3 class="text-xl font-bold text-slate-900">Md. Rahman</h3>
              <Badge variant="success">Verified</Badge>
            </div>
            <p class="text-sm text-slate-500">@md_rahman</p>
            
            <div class="grid grid-cols-2 gap-4 mt-6">
              <div>
                <label class="text-xs font-semibold text-slate-500 uppercase">Email</label>
                <p class="text-slate-900 mt-1">rahman@example.com</p>
              </div>
              <div>
                <label class="text-xs font-semibold text-slate-500 uppercase">Phone</label>
                <p class="text-slate-900 mt-1">+880 1712345678</p>
              </div>
              <div>
                <label class="text-xs font-semibold text-slate-500 uppercase">Owner ID</label>
                <p class="text-slate-900 mt-1 font-mono">550e8400-e29b...</p>
              </div>
              <div>
                <label class="text-xs font-semibold text-slate-500 uppercase">Account Status</label>
                <p class="text-slate-700 mt-1">Active</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl border border-slate-200 p-6">
        <h3 class="text-lg font-semibold text-slate-900 mb-4">Account Verification</h3>
        <div class="space-y-4">
          <div class="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div class="flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-green-600">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span class="text-sm text-green-900">Email Verified</span>
            </div>
            <span class="text-xs text-green-600">Jan 10, 2024</span>
          </div>
          
          <div class="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div class="flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-green-600">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span class="text-sm text-green-900">Phone Verified</span>
            </div>
            <span class="text-xs text-green-600">Jan 10, 2024</span>
          </div>

          <div class="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
            <div class="flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-slate-400">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              <span class="text-sm text-slate-600">Shop Ownership Verified</span>
            </div>
            <Badge variant="success" size="sm">Verified</Badge>
          </div>
        </div>
      </div>
    </div>
  );
}