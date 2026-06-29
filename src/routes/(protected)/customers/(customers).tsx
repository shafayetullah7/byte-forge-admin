import { A, createAsync, type RouteDefinition } from "@solidjs/router";
import {
  createDeferred,
  createEffect,
  createMemo,
  createSignal,
  For,
  Show,
  Suspense,
} from "solid-js";
import { createStore } from "solid-js/store";
import { Meta, Title } from "@solidjs/meta";
import { SafeErrorBoundary, InlineErrorFallback } from "~/components/errors";
import { PageHeader } from "~/components/layout/PageHeader";
import { PageShell } from "~/components/layout/PageShell";
import { Pagination } from "~/components/ui/Pagination";
import { UsersIcon } from "~/components/icons";
import { getAdminUsers, type AdminUserSummary } from "~/lib/api/endpoints/users";
import type { PaginatedResult } from "~/lib/api/types";

export const route: RouteDefinition = {
  preload: () => getAdminUsers({ limit: 10 }),
};

export default function CustomersPage() {
  const [page, setPage] = createSignal(1);
  const [limit, setLimit] = createSignal(10);
  const [filters, setFilters] = createStore({ search: "" });
  const debouncedSearch = createDeferred(() => filters.search, { timeoutMs: 300 });

  const usersData = createAsync(() =>
    getAdminUsers({
      page: page(),
      limit: limit(),
      search: debouncedSearch() || undefined,
    }),
  );

  const [stableUsers, setStableUsers] = createSignal<
    PaginatedResult<AdminUserSummary> | undefined
  >(undefined);

  createEffect(() => {
    const data = usersData();
    if (data !== undefined) {
      setStableUsers(data);
    }
  });

  createEffect(() => {
    debouncedSearch();
    if (page() !== 1) setPage(1);
  });

  const displayUsers = createMemo(() => stableUsers()?.data ?? []);

  return (
    <PageShell>
      <Title>Customers | ByteForge Admin</Title>
      <Meta name="description" content="Search buyers for support and order lookup." />

      <PageHeader
        title="Customers"
        description="Find buyers by name, username, or email."
        icon={UsersIcon}
      />

      <div class="mb-4 rounded-xl border border-slate-200 bg-white p-4">
        <input
          type="text"
          placeholder="Search name, username, or email..."
          class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-green-500 md:max-w-md"
          value={filters.search}
          onInput={(event) => setFilters("search", event.currentTarget.value)}
        />
      </div>

      <SafeErrorBoundary
        fallback={(err, reset) => (
          <InlineErrorFallback error={err} reset={reset} label="customers list" />
        )}
      >
        <Show
          when={stableUsers()}
          fallback={<div class="h-96 animate-pulse rounded-2xl bg-slate-50" />}
        >
          <div class="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead class="border-b border-slate-200 bg-slate-50">
                  <tr class="text-left text-xs font-semibold uppercase text-slate-600">
                    <th class="px-6 py-3">Customer</th>
                    <th class="px-6 py-3">Email</th>
                    <th class="px-6 py-3">Joined</th>
                    <th class="px-6 py-3" />
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  <Show
                    when={displayUsers().length > 0}
                    fallback={
                      <tr>
                        <td colSpan={4} class="px-6 py-12 text-center text-sm text-slate-500">
                          No customers found.
                        </td>
                      </tr>
                    }
                  >
                    <For each={displayUsers()}>
                      {(user) => (
                        <tr class="hover:bg-slate-50">
                          <td class="px-6 py-4">
                            <div class="font-medium text-slate-900">
                              {user.firstName} {user.lastName}
                            </div>
                            <div class="text-xs text-slate-500">@{user.userName}</div>
                          </td>
                          <td class="px-6 py-4 text-sm text-slate-600">
                            {user.email ?? "—"}
                          </td>
                          <td class="px-6 py-4 text-sm text-slate-600">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </td>
                          <td class="px-6 py-4 text-right">
                            <A
                              href={`/customers/${user.id}`}
                              class="text-sm font-medium text-primary-green-700 hover:underline"
                            >
                              View
                            </A>
                          </td>
                        </tr>
                      )}
                    </For>
                  </Show>
                </tbody>
              </table>
            </div>
          </div>
        </Show>
      </SafeErrorBoundary>

      <Show when={stableUsers()?.meta}>
        {(meta) => (
          <Pagination
            meta={meta()}
            onPageChange={setPage}
            onLimitChange={(newLimit) => {
              setLimit(newLimit);
              if (page() !== 1) setPage(1);
            }}
            showLimitSelector
          />
        )}
      </Show>
    </PageShell>
  );
}
