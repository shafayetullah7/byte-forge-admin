import { A, createAsync, useAction, useParams, useSubmission, type RouteDefinition } from "@solidjs/router";
import { createSignal, Show, Suspense } from "solid-js";
import { Meta, Title } from "@solidjs/meta";
import { Badge } from "~/components/ui/Badge";
import { Button } from "~/components/ui/Button";
import { PageHeader } from "~/components/layout/PageHeader";
import { PageShell } from "~/components/layout/PageShell";
import { InventoryIcon } from "~/components/icons";
import {
  archiveAdminProduct,
  getAdminProduct,
  restoreAdminProduct,
} from "~/lib/api/endpoints/products";

export const route: RouteDefinition = {
  preload: ({ params }) => getAdminProduct(params.product_id!),
};

const formatDateTime = (value: string) =>
  new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

export default function ProductDetailPage() {
  const params = useParams();
  const product = createAsync(() => getAdminProduct(params.product_id!));
  const archiveAction = useAction(archiveAdminProduct);
  const restoreAction = useAction(restoreAdminProduct);
  const archiveSubmission = useSubmission(archiveAdminProduct);
  const restoreSubmission = useSubmission(restoreAdminProduct);
  const [confirmMode, setConfirmMode] = createSignal<"archive" | "restore" | null>(null);
  const [actionError, setActionError] = createSignal<string | null>(null);

  const actionLoading = () =>
    archiveSubmission.pending || restoreSubmission.pending;

  const handleArchive = async () => {
    setActionError(null);
    try {
      await archiveAction({
        productId: params.product_id!,
        reason: "Archived by admin moderation",
      });
      setConfirmMode(null);
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Failed to archive product");
    }
  };

  const handleRestore = async () => {
    setActionError(null);
    try {
      await restoreAction(params.product_id!);
      setConfirmMode(null);
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Failed to restore product");
    }
  };

  return (
    <PageShell>
      <Title>{product()?.name ?? "Product"} | ByteForge Admin</Title>

      <Suspense fallback={<div class="text-sm text-slate-500">Loading product...</div>}>
        <Show when={product()}>
          {(data) => (
            <>
              <PageHeader
                title={data().name}
                description={`/${data().slug} · Updated ${formatDateTime(data().updatedAt)}`}
                icon={InventoryIcon}
              />

              <div class="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                <div class="rounded-xl border border-slate-200 bg-white p-5">
                  <p class="text-xs font-semibold uppercase text-slate-500">Status</p>
                  <div class="mt-2">
                    <Badge variant={data().status === "ACTIVE" ? "success" : data().status === "ARCHIVED" ? "danger" : "warning"}>
                      {data().status}
                    </Badge>
                  </div>
                </div>
                <div class="rounded-xl border border-slate-200 bg-white p-5">
                  <p class="text-xs font-semibold uppercase text-slate-500">Price / Stock</p>
                  <p class="mt-2 text-lg font-bold text-slate-900">
                    {data().price ? `৳ ${Number(data().price).toLocaleString()}` : "—"}
                  </p>
                  <p class="text-sm text-slate-500">{data().inventoryCount} in stock</p>
                </div>
                <div class="rounded-xl border border-slate-200 bg-white p-5">
                  <p class="text-xs font-semibold uppercase text-slate-500">Shop</p>
                  <p class="mt-2 font-medium text-slate-900">{data().shop.name}</p>
                  <A
                    href={`/shops/${data().shop.id}`}
                    class="text-sm text-primary-green-700 hover:underline"
                  >
                    View shop
                  </A>
                </div>
              </div>

              <div class="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div class="rounded-xl border border-slate-200 bg-white p-6">
                  <h3 class="mb-4 text-lg font-semibold text-slate-900">English</h3>
                  <p class="font-medium text-slate-900">{data().translations.en.name}</p>
                  <Show when={data().translations.en.shortDescription}>
                    <p class="mt-2 text-sm text-slate-600">{data().translations.en.shortDescription}</p>
                  </Show>
                </div>
                <div class="rounded-xl border border-slate-200 bg-white p-6">
                  <h3 class="mb-4 text-lg font-semibold text-slate-900">Bengali</h3>
                  <p class="font-medium text-slate-900">
                    {data().translations.bn.name ?? "—"}
                  </p>
                  <Show when={data().translations.bn.shortDescription}>
                    <p class="mt-2 text-sm text-slate-600">{data().translations.bn.shortDescription}</p>
                  </Show>
                </div>
              </div>

              <div class="rounded-xl border border-slate-200 bg-white p-6">
                <h3 class="mb-4 text-lg font-semibold text-slate-900">Moderation</h3>
                <p class="mb-4 text-sm text-slate-600">
                  Archiving removes this product from public listings. Restore only works when the
                  shop is active.
                </p>

                <Show when={data().status !== "ARCHIVED"}>
                  <Show
                    when={confirmMode() === "archive"}
                    fallback={
                      <Button variant="danger" onClick={() => setConfirmMode("archive")}>
                        Archive product
                      </Button>
                    }
                  >
                    <div class="space-y-3 rounded-xl border border-red-200 bg-red-50 p-4">
                      <p class="text-sm text-slate-700">
                        Archive <strong>{data().name}</strong>? It will be hidden from buyers.
                      </p>
                      <Show when={actionError()}>
                        <p class="text-xs text-red-600">{actionError()}</p>
                      </Show>
                      <div class="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setConfirmMode(null)}
                          disabled={actionLoading()}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          isLoading={actionLoading()}
                          onClick={handleArchive}
                        >
                          Confirm archive
                        </Button>
                      </div>
                    </div>
                  </Show>
                </Show>

                <Show when={data().status === "ARCHIVED"}>
                  <Show
                    when={confirmMode() === "restore"}
                    fallback={
                      <Button variant="primary" onClick={() => setConfirmMode("restore")}>
                        Restore product
                      </Button>
                    }
                  >
                    <div class="space-y-3 rounded-xl border border-primary-green-200 bg-primary-green-50 p-4">
                      <p class="text-sm text-slate-700">
                        Restore <strong>{data().name}</strong> to active listings?
                      </p>
                      <Show when={actionError()}>
                        <p class="text-xs text-red-600">{actionError()}</p>
                      </Show>
                      <div class="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setConfirmMode(null)}
                          disabled={actionLoading()}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          isLoading={actionLoading()}
                          onClick={handleRestore}
                        >
                          Confirm restore
                        </Button>
                      </div>
                    </div>
                  </Show>
                </Show>
              </div>
            </>
          )}
        </Show>
      </Suspense>
    </PageShell>
  );
}
