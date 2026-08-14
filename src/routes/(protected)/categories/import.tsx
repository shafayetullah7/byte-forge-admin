import { createEffect, createMemo, createSignal, Show } from "solid-js";
import { useAction } from "@solidjs/router";
import { Title, Meta } from "@solidjs/meta";
import { A } from "@solidjs/router";
import { Button } from "~/components/ui/Button";
import { Card } from "~/components/ui/Card";
import { FormHeader } from "~/components/layout/FormHeader";
import { PageShell } from "~/components/layout/PageShell";
import { SafeErrorBoundary, PageErrorFallback } from "~/components/errors";
import { bulkImportCategories } from "~/lib/api/endpoints/categories/categories-bulk-import.actions";
import type {
  BulkImportCategoriesResult,
  BulkImportCategoryInput,
} from "~/lib/api/endpoints/categories/categories-bulk-import.types";
import { ApiError } from "~/lib/api/types";
import {
  CATEGORY_BULK_IMPORT_EXAMPLE,
  CATEGORY_BULK_IMPORT_SESSION_KEY,
} from "~/components/taxonomy/bulk-import/category-import.example";
import { CategoryImportPreview } from "~/components/taxonomy/bulk-import/CategoryImportPreview";
import { ImportDraftBanner } from "~/components/taxonomy/bulk-import/ImportDraftBanner";
import {
  buildImportPayload,
  buildPreviewRows,
  countPreviewStatus,
  parseCategoryImportJson,
} from "~/components/taxonomy/bulk-import/category-import.schema";

type WizardStep = "paste" | "preview" | "review" | "result";

export default function CategoryBulkImportPage() {
  const importAction = useAction(bulkImportCategories);

  const [step, setStep] = createSignal<WizardStep>("paste");
  const [rawJson, setRawJson] = createSignal("");
  const [parseError, setParseError] = createSignal<string | null>(null);
  const [items, setItems] = createSignal<BulkImportCategoryInput[]>([]);
  const [onDuplicate, setOnDuplicate] = createSignal<"skip" | "error" | "upsert">("skip");
  const [draftBannerVisible, setDraftBannerVisible] = createSignal(false);
  const [confirmed, setConfirmed] = createSignal(false);
  const [submitting, setSubmitting] = createSignal(false);
  const [submitError, setSubmitError] = createSignal<string | null>(null);
  const [dryRunResult, setDryRunResult] = createSignal<BulkImportCategoriesResult | null>(null);
  const [importResult, setImportResult] = createSignal<BulkImportCategoriesResult | null>(null);

  createEffect(() => {
    if (typeof window === "undefined") return;
    const saved = sessionStorage.getItem(CATEGORY_BULK_IMPORT_SESSION_KEY);
    if (saved) {
      try {
        const draft = JSON.parse(saved) as {
          rawJson?: string;
          items?: BulkImportCategoryInput[];
          step?: WizardStep;
        };
        if (draft.rawJson) setRawJson(draft.rawJson);
        if (draft.items) setItems(draft.items);
        if (draft.step && draft.step !== "result") setStep(draft.step);
        setDraftBannerVisible(true);
      } catch {
        sessionStorage.removeItem(CATEGORY_BULK_IMPORT_SESSION_KEY);
      }
    }
  });

  createEffect(() => {
    if (typeof window === "undefined") return;
    if (step() === "result") return;
    sessionStorage.setItem(
      CATEGORY_BULK_IMPORT_SESSION_KEY,
      JSON.stringify({
        rawJson: rawJson(),
        items: items(),
        step: step(),
      }),
    );
  });

  const previewRows = createMemo(() => buildPreviewRows(items()));
  const previewCounts = createMemo(() => countPreviewStatus(previewRows()));

  const runDryRun = async () => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const result = await importAction(
        buildImportPayload(items(), { dryRun: true, onDuplicate: onDuplicate() }),
      );
      setDryRunResult(result);
      return result;
    } catch (error) {
      setSubmitError(formatError(error));
      return null;
    } finally {
      setSubmitting(false);
    }
  };

  const handleDuplicatePolicyChange = (policy: "skip" | "error" | "upsert") => {
    setOnDuplicate(policy);
    if (step() === "review") void runDryRun();
  };

  const handleParseAndPreview = () => {
    const { payload, parseError: error } = parseCategoryImportJson(rawJson());
    setParseError(error ?? null);
    if (!payload) return;
    setItems(payload);
    setDryRunResult(null);
    setImportResult(null);
    setStep("preview");
  };

  const handleContinueToReview = async () => {
    const result = await runDryRun();
    if (!result) return;
    setStep("review");
  };

  const handleImport = async () => {
    if (!confirmed()) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const result = await importAction(
        buildImportPayload(items(), { dryRun: false, onDuplicate: onDuplicate() }),
      );
      setImportResult(result);
      sessionStorage.removeItem(CATEGORY_BULK_IMPORT_SESSION_KEY);
      setStep("result");
    } catch (error) {
      setSubmitError(formatError(error));
    } finally {
      setSubmitting(false);
    }
  };

  const resetWizard = () => {
    setStep("paste");
    setRawJson("");
    setItems([]);
    setParseError(null);
    setDryRunResult(null);
    setImportResult(null);
    setConfirmed(false);
    setSubmitError(null);
    sessionStorage.removeItem(CATEGORY_BULK_IMPORT_SESSION_KEY);
  };

  const dismissDraftBanner = () => {
    setDraftBannerVisible(false);
  };

  return (
    <SafeErrorBoundary fallback={(err, reset) => <PageErrorFallback error={err} reset={reset} />}>
      <PageShell>
        <Title>Bulk Import Categories | ByteForge Admin</Title>
        <Meta name="description" content="Import categories from JSON" />

        <FormHeader
          title="Bulk import categories"
          subtitle="Paste JSON to create category trees (up to 3 levels). Supports nested children or flat items with parentSlug."
          backHref="/categories"
          backLabel="Back to Categories"
        />

        <div class="mb-6 flex flex-wrap gap-2 text-sm">
          <StepPill label="1. Paste JSON" active={step() === "paste"} done={step() !== "paste"} />
          <StepPill label="2. Preview" active={step() === "preview"} done={["review", "result"].includes(step())} />
          <StepPill label="3. Review" active={step() === "review"} done={step() === "result"} />
          <StepPill label="4. Result" active={step() === "result"} done={false} />
        </div>

        <ImportDraftBanner
          visible={draftBannerVisible()}
          onResume={dismissDraftBanner}
          onDiscard={() => {
            resetWizard();
            setDraftBannerVisible(false);
          }}
        />

        <Show when={step() === "paste"}>
          <Card class="p-6 space-y-4">
            <p class="text-sm text-slate-600">
              Provide a JSON object with an <code class="font-mono text-slate-800">items</code> array.
              Use nested <code class="font-mono">children</code> or flat rows with{" "}
              <code class="font-mono">parentSlug</code>. English name is required; Bengali is recommended.
            </p>
            <textarea
              class="w-full min-h-[320px] rounded-xl border border-slate-200 bg-slate-950 text-slate-100 font-mono text-sm p-4 focus:outline-none focus:ring-2 focus:ring-primary-green-500/30"
              value={rawJson()}
              onInput={(event) => setRawJson(event.currentTarget.value)}
              spellcheck={false}
            />
            <Show when={parseError()}>
              <p class="text-sm text-red-600">{parseError()}</p>
            </Show>
            <div class="flex flex-wrap gap-3">
              <Button type="button" variant="outline" onClick={() => setRawJson(CATEGORY_BULK_IMPORT_EXAMPLE)}>
                Load example
              </Button>
              <Button type="button" variant="outline" onClick={() => setRawJson("")}>
                Clear
              </Button>
              <Button type="button" variant="primary" onClick={handleParseAndPreview}>
                Continue to preview
              </Button>
            </div>
          </Card>
        </Show>

        <Show when={step() === "preview"}>
          <div class="space-y-4">
            <Card class="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <p class="text-sm text-slate-700">
                <span class="font-semibold text-slate-900">{previewCounts().ready} ready</span>
                <span class="mx-2 text-slate-300">·</span>
                <span class="font-semibold text-amber-600">{previewCounts().warnings} warnings</span>
                <span class="mx-2 text-slate-300">·</span>
                <span class="font-semibold text-red-600">{previewCounts().errors} errors</span>
              </p>
              <div class="flex gap-3">
                <Button type="button" variant="outline" onClick={() => setStep("paste")}>
                  Back to JSON
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  disabled={previewCounts().errors > 0}
                  onClick={handleContinueToReview}
                  isLoading={submitting()}
                >
                  Continue to review
                </Button>
              </div>
            </Card>
            <CategoryImportPreview rows={previewRows()} />
          </div>
        </Show>

        <Show when={step() === "review"}>
          <Card class="p-6 space-y-4">
            <h2 class="text-base font-bold text-slate-900">Review import</h2>
            <Show when={dryRunResult() && !dryRunResult()!.success}>
              <p class="text-sm text-red-600">
                Dry-run found blocking issues. Adjust duplicate handling or fix the JSON, then try again.
              </p>
            </Show>
            <Show when={dryRunResult()}>
              {(result) => (
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <SummaryTile
                    label="Categories to create"
                    value={String(result().summary.categoriesCreated)}
                  />
                  <SummaryTile label="Updated" value={String(result().summary.updated)} />
                  <SummaryTile label="Skipped" value={String(result().summary.skipped)} />
                  <SummaryTile label="Errors" value={String(result().summary.errors)} />
                </div>
              )}
            </Show>

            <div class="space-y-2">
              <p class="text-sm font-semibold text-slate-800">If a slug already exists</p>
              <div class="flex flex-col sm:flex-row gap-3">
                <label class="flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="radio"
                    name="duplicate-policy"
                    checked={onDuplicate() === "skip"}
                    onChange={() => handleDuplicatePolicyChange("skip")}
                  />
                  Skip duplicates (recommended)
                </label>
                <label class="flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="radio"
                    name="duplicate-policy"
                    checked={onDuplicate() === "error"}
                    onChange={() => handleDuplicatePolicyChange("error")}
                  />
                  Fail import on duplicates
                </label>
                <label class="flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="radio"
                    name="duplicate-policy"
                    checked={onDuplicate() === "upsert"}
                    onChange={() => handleDuplicatePolicyChange("upsert")}
                  />
                  Update existing rows (translations and status)
                </label>
              </div>
            </div>

            <label class="flex items-start gap-3 text-sm text-slate-700">
              <input
                type="checkbox"
                class="mt-1"
                checked={confirmed()}
                onChange={(event) => setConfirmed(event.currentTarget.checked)}
              />
              I reviewed the preview and dry-run summary.
            </label>

            <Show when={submitError()}>
              <p class="text-sm text-red-600">{submitError()}</p>
            </Show>

            <div class="flex flex-wrap gap-3">
              <Button type="button" variant="outline" onClick={() => setStep("preview")}>
                Back
              </Button>
              <Button
                type="button"
                variant="primary"
                disabled={!confirmed() || dryRunResult()?.success === false}
                isLoading={submitting()}
                onClick={handleImport}
              >
                Import now
              </Button>
            </div>
          </Card>
        </Show>

        <Show when={step() === "result" && importResult()}>
          {(result) => (
            <Card class="p-6 space-y-4">
              <h2 class="text-base font-bold text-slate-900">
                {result().success ? "Import completed" : "Import finished with issues"}
              </h2>
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <SummaryTile
                  label="Categories created"
                  value={String(result().summary.categoriesCreated)}
                />
                <SummaryTile label="Updated" value={String(result().summary.updated)} />
                <SummaryTile label="Skipped" value={String(result().summary.skipped)} />
                <SummaryTile label="Errors" value={String(result().summary.errors)} />
              </div>
              <div class="max-h-80 overflow-y-auto rounded-xl border border-slate-200">
                <table class="w-full text-sm">
                  <thead class="bg-slate-50 text-left text-[11px] uppercase tracking-wider text-slate-500">
                    <tr>
                      <th class="px-4 py-3">Slug</th>
                      <th class="px-4 py-3">Status</th>
                      <th class="px-4 py-3">Message</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result().results.map((row) => (
                      <tr class="border-t border-slate-100">
                        <td class="px-4 py-3 font-mono">{row.slug}</td>
                        <td class="px-4 py-3">{row.status}</td>
                        <td class="px-4 py-3 text-slate-600">{row.message ?? "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div class="flex flex-wrap gap-3">
                <Button type="button" variant="outline" onClick={resetWizard}>
                  Import more
                </Button>
                <A href="/categories">
                  <Button type="button" variant="primary">
                    View categories
                  </Button>
                </A>
              </div>
            </Card>
          )}
        </Show>
      </PageShell>
    </SafeErrorBoundary>
  );
}

function StepPill(props: { label: string; active: boolean; done: boolean }) {
  return (
    <span
      class={`px-3 py-1.5 rounded-full border text-xs font-semibold ${
        props.active
          ? "bg-primary-green-600 text-white border-primary-green-600"
          : props.done
            ? "bg-primary-green-50 text-primary-green-800 border-primary-green-200"
            : "bg-white text-slate-500 border-slate-200"
      }`}
    >
      {props.label}
    </span>
  );
}

function SummaryTile(props: { label: string; value: string }) {
  return (
    <div class="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
      <p class="text-xs uppercase tracking-wider text-slate-500">{props.label}</p>
      <p class="text-2xl font-bold text-slate-900 mt-1">{props.value}</p>
    </div>
  );
}

function formatError(error: unknown): string {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error) return error.message;
  return "Bulk import failed";
}
