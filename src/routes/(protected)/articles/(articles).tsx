import { A } from "@solidjs/router";
import { createMemo, createSignal, For, Show, Suspense } from "solid-js";
import { createAsync, type RouteDefinition } from "@solidjs/router";
import { Meta, Title } from "@solidjs/meta";
import { Badge } from "~/components/ui/Badge";
import { Card } from "~/components/ui/Card";
import { SafeErrorBoundary, PageErrorFallback } from "~/components/errors";
import { PageHeader } from "~/components/layout/PageHeader";
import { PageShell } from "~/components/layout/PageShell";
import { DocumentIcon } from "~/components/icons";
import {
  getAdminArticles,
  type AdminArticleListItem,
  type ModerationStatus,
} from "~/lib/api/endpoints/articles";

export const route: RouteDefinition = {
  preload: () => getAdminArticles({ moderationStatus: "PENDING", limit: 50 }),
};

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const statusBadge = (status: ModerationStatus) => {
  if (status === "PENDING") return "warning";
  if (status === "APPROVED") return "success";
  if (status === "REJECTED") return "danger";
  return "neutral";
};

const statusFilters = ["PENDING", "APPROVED", "REJECTED", ""] as const;

export default function ArticlesModerationPage() {
  const [statusFilter, setStatusFilter] = createSignal<"" | ModerationStatus>("PENDING");

  const articlesData = createAsync(() =>
    getAdminArticles({
      moderationStatus: statusFilter() || undefined,
      limit: 50,
    }),
  );

  const articles = () => articlesData()?.data ?? [];
  const metrics = createMemo(() => {
    const rows = articles();
    return {
      total: articlesData()?.meta.total ?? rows.length,
      pending: rows.filter((item) => item.moderationStatus === "PENDING").length,
      approved: rows.filter((item) => item.moderationStatus === "APPROVED").length,
      editorsPick: rows.filter((item) => item.isEditorsPick).length,
    };
  });

  return (
    <SafeErrorBoundary fallback={(err, reset) => <PageErrorFallback error={err} reset={reset} />}>
      <PageShell>
        <Title>Articles | ByteForge Admin</Title>
        <Meta
          name="description"
          content="Review and moderate seller shop articles before publication."
        />

        <PageHeader
          title="Article Moderation"
          description="Review pending shop articles, approve quality content, and curate editor's picks."
          icon={DocumentIcon}
        />

        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card class="p-4">
            <p class="text-xs font-semibold text-slate-500 uppercase">Total</p>
            <p class="text-2xl font-bold text-slate-900">{metrics().total}</p>
          </Card>
          <Card class="p-4">
            <p class="text-xs font-semibold text-slate-500 uppercase">Pending</p>
            <p class="text-2xl font-bold text-amber-700">{metrics().pending}</p>
          </Card>
          <Card class="p-4">
            <p class="text-xs font-semibold text-slate-500 uppercase">Approved</p>
            <p class="text-2xl font-bold text-primary-green-700">{metrics().approved}</p>
          </Card>
          <Card class="p-4">
            <p class="text-xs font-semibold text-slate-500 uppercase">Editor's Pick</p>
            <p class="text-2xl font-bold text-indigo-700">{metrics().editorsPick}</p>
          </Card>
        </div>

        <div class="flex flex-wrap gap-2 mb-6">
          <For each={statusFilters}>
            {(status) => (
              <button
                type="button"
                class={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  statusFilter() === status
                    ? "bg-slate-800 text-white"
                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
                onClick={() => setStatusFilter(status)}
              >
                {status || "ALL"}
              </button>
            )}
          </For>
        </div>

        <Suspense fallback={<Card class="h-64 animate-pulse bg-slate-50 border-slate-200 shadow-sm" />}>
          <div class="space-y-4">
            <For
              each={articles()}
              fallback={
                <Card class="py-16 text-center">
                  <p class="font-semibold text-slate-700">No articles found</p>
                  <p class="text-sm text-slate-500 mt-1">
                    Adjust filters to inspect more items.
                  </p>
                </Card>
              }
            >
              {(article: AdminArticleListItem) => (
                <Card class="p-5 border-slate-200 shadow-sm">
                  <div class="flex flex-col lg:flex-row gap-4 lg:items-center">
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center gap-2 mb-2 flex-wrap">
                        <Badge variant={statusBadge(article.moderationStatus) as any}>
                          {article.moderationStatus}
                        </Badge>
                        <Show when={article.isEditorsPick}>
                          <span class="text-xs font-medium text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full">
                            Editor's Pick
                          </span>
                        </Show>
                        <Show when={article.category}>
                          <span class="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                            {article.category}
                          </span>
                        </Show>
                      </div>
                      <h3 class="font-semibold text-slate-900">{article.title || "Untitled article"}</h3>
                      <p class="text-xs text-slate-400 mt-2">
                        Submitted {formatDate(article.createdAt)} · Shop{" "}
                        {article.shop?.name ?? "Unknown"}
                        <Show when={article.publishedAt}>
                          {" "}
                          · Published {formatDate(article.publishedAt!)}
                        </Show>
                      </p>
                    </div>
                    <A
                      href={`/articles/${article.id}`}
                      class="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      Review
                    </A>
                  </div>
                </Card>
              )}
            </For>
          </div>
        </Suspense>
      </PageShell>
    </SafeErrorBoundary>
  );
}
