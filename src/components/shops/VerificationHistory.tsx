import type { VerificationHistory as VerificationHistoryType } from "~/lib/api/endpoints/shops";

interface VerificationHistoryProps {
  history: VerificationHistoryType[];
}

export function VerificationHistory(props: VerificationHistoryProps) {
  if (!props.history || props.history.length === 0) {
    return (
      <div class="text-center py-8">
        <p class="text-sm text-slate-500">No verification history available</p>
      </div>
    );
  }

  const formatAction = (action: string) => {
    const actions: Record<string, string> = {
      submitted: "Submitted for Verification",
      approved: "Approved",
      rejected: "Rejected",
      suspended: "Suspended",
      activated: "Activated",
      deactivated: "Deactivated",
    };
    return actions[action] || action;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      DRAFT: "bg-slate-400",
      PENDING_VERIFICATION: "bg-yellow-400",
      APPROVED: "bg-green-500",
      ACTIVE: "bg-blue-500",
      INACTIVE: "bg-slate-400",
      REJECTED: "bg-red-500",
      SUSPENDED: "bg-red-500",
      DELETED: "bg-slate-400",
    };
    return colors[status] || "bg-slate-400";
  };

  return (
    <div class="space-y-4">
      <div class="space-y-3">
        {props.history.map((item, index) => (
          <div class="flex gap-4">
            {/* Timeline Dot */}
            <div class="flex flex-col items-center">
              <div class={`w-3 h-3 rounded-full ${getStatusColor(item.newStatus)}`} />
              {index < props.history.length - 1 && (
                <div class="w-px h-full bg-slate-200 mt-2" />
              )}
            </div>

            {/* Content */}
            <div class="flex-1 pb-4">
              <div class="flex justify-between items-start">
                <div>
                  <p class="font-medium text-slate-900">{formatAction(item.action)}</p>
                  <p class="text-sm text-slate-600 mt-1">
                    {item.previousStatus} → {item.newStatus}
                  </p>
                </div>
                <p class="text-xs text-slate-500">
                  {new Date(item.createdAt).toLocaleString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>

              {item.reason && (
                <div class="mt-2 p-3 bg-slate-50 rounded-lg">
                  <p class="text-xs font-semibold text-slate-500 uppercase mb-1">Reason</p>
                  <p class="text-sm text-slate-700">{item.reason}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
