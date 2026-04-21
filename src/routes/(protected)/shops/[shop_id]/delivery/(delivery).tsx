import { useParams } from "@solidjs/router";
import { DeliveryTab } from "../components";

export default function DeliveryRoute() {
  const params = useParams();
  return <DeliveryTab shopId={params.shop_id} />;
}
