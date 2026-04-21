import { useParams } from "@solidjs/router";
import { DashboardTab } from "../components";

export default function DashboardRoute() {
  const params = useParams();
  return <DashboardTab shopId={params.shop_id} />;
}
