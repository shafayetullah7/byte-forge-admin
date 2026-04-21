import { Badge } from "~/components/ui/Badge";
import { Button } from "~/components/ui/Button";
import { For, Show } from "solid-js";

export function VerificationTab() {
  return (
    <div class="space-y-6">
      <div class="bg-amber-50 border border-amber-200 rounded-xl p-6">
        <div class="flex items-start justify-between">
          <div class="flex items-start gap-4">
            <div class="p-3 bg-amber-100 rounded-xl">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-amber-600">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                <line x1="12" y1="19" x2="12" y2="23"></line>
                <line x1="8" y1="23" x2="16" y2="23"></line>
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-amber-900">Under Review</h3>
              <p class="text-sm text-amber-700 mt-1">This shop is pending verification. Review the documents below.</p>
              <div class="flex items-center gap-2 mt-3">
                <Badge variant="warning">PENDING</Badge>
                <span class="text-xs text-amber-600">Submitted on Jan 15, 2024</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl border border-slate-200 p-6">
        <h3 class="text-lg font-semibold text-slate-900 mb-4">Verification Actions</h3>
        <div class="flex flex-wrap gap-3">
          <Button variant="primary" size="md">Approve Shop</Button>
          <Button variant="outline" size="md">Reject</Button>
          <Button variant="outline" size="md">Request More Documents</Button>
        </div>
      </div>

      <div class="bg-white rounded-xl border border-slate-200 p-6">
        <h3 class="text-lg font-semibold text-slate-900 mb-4">Verification Documents</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="border border-slate-200 rounded-lg p-4">
            <div class="flex items-center justify-between mb-3">
              <h4 class="text-sm font-semibold text-slate-700">Trade License</h4>
              <Badge variant="success" size="sm">Uploaded</Badge>
            </div>
            <div class="mb-3">
              <label class="text-xs text-slate-500">Number/ID</label>
              <p class="text-sm text-slate-900 font-mono">TL-2024-789234</p>
            </div>
            <a href="#" class="flex items-center gap-2 text-sm text-primary-green-600 hover:text-primary-green-700 font-medium">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
              View Document
            </a>
          </div>

          <div class="border border-slate-200 rounded-lg p-4">
            <div class="flex items-center justify-between mb-3">
              <h4 class="text-sm font-semibold text-slate-700">TIN Certificate</h4>
              <Badge variant="success" size="sm">Uploaded</Badge>
            </div>
            <div class="mb-3">
              <label class="text-xs text-slate-500">Number/ID</label>
              <p class="text-sm text-slate-900 font-mono">TIN-987654321</p>
            </div>
            <a href="#" class="flex items-center gap-2 text-sm text-primary-green-600 hover:text-primary-green-700 font-medium">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
              View Document
            </a>
          </div>

          <div class="border border-slate-200 rounded-lg p-4">
            <div class="flex items-center justify-between mb-3">
              <h4 class="text-sm font-semibold text-slate-700">Utility Bill</h4>
              <Badge variant="danger" size="sm">Missing</Badge>
            </div>
            <p class="text-xs text-slate-400 italic">No document uploaded</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl border border-slate-200 p-6">
        <h3 class="text-lg font-semibold text-slate-900 mb-4">Admin Notes</h3>
        <textarea
          class="w-full h-24 px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-primary-green-500 focus:border-primary-green-500 text-sm"
          placeholder="Add notes about this verification..."
        />
        <div class="flex justify-end mt-3">
          <Button variant="outline" size="sm">Save Notes</Button>
        </div>
      </div>

      <div class="bg-white rounded-xl border border-slate-200 p-6">
        <h3 class="text-lg font-semibold text-slate-900 mb-4">Verification History</h3>
        <div class="space-y-3">
          <div class="flex items-start gap-3">
            <div class="w-2 h-2 rounded-full bg-slate-300 mt-2"></div>
            <div>
              <p class="text-sm text-slate-900">Shop submitted for verification</p>
              <p class="text-xs text-slate-500">Jan 15, 2024 at 10:30 AM</p>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <div class="w-2 h-2 rounded-full bg-amber-400 mt-2"></div>
            <div>
              <p class="text-sm text-slate-900">Admin started review</p>
              <p class="text-xs text-slate-500">Jan 16, 2024 at 2:15 PM</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}