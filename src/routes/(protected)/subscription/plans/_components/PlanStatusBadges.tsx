import { Badge } from "~/components/ui/Badge";
import type { SubscriptionPlan } from "~/lib/api/endpoints/subscription-plans";

export function PlanStatusBadge(props: { plan: SubscriptionPlan }) {
  if (props.plan.isRetired) {
    return (
      <Badge variant="secondary" size="sm">
        Retired
      </Badge>
    );
  }

  if (props.plan.isActiveForNew) {
    return (
      <Badge variant="success" size="sm">
        Active
      </Badge>
    );
  }

  return (
    <Badge variant="warning" size="sm">
      Hidden
    </Badge>
  );
}

export function StripeSyncBadge(props: { plan: SubscriptionPlan }) {
  if (props.plan.stripePriceId) {
    return (
      <Badge variant="success" size="sm">
        Synced
      </Badge>
    );
  }

  return (
    <Badge variant="secondary" size="sm">
      Not synced
    </Badge>
  );
}
