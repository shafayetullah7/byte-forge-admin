import { Badge } from "~/components/ui/Badge";

export function CouponStatusBadge(props: { isActive: boolean }) {
  if (props.isActive) {
    return (
      <Badge variant="success" size="sm">
        Active
      </Badge>
    );
  }

  return (
    <Badge variant="secondary" size="sm">
      Inactive
    </Badge>
  );
}
