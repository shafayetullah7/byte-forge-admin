import { z } from "zod";
import type {
  BulkImportCategoriesPayload,
  BulkImportCategoryInput,
  PreviewCategoryRow,
} from "~/lib/api/endpoints/categories/categories-bulk-import.types";

const slugSchema = z
  .string()
  .trim()
  .min(1, "Slug is required")
  .max(255)
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Slug must be lowercase alphanumeric with hyphens only",
  );

const translationRecordSchema = z.object({
  en: z.object({
    name: z.string().trim().min(1, "English name is required").max(255),
    description: z.string().optional().nullable(),
  }),
  bn: z
    .object({
      name: z.string().trim().max(255),
      description: z.string().optional().nullable(),
    })
    .optional(),
});

const categoryNodeSchema: z.ZodType<BulkImportCategoryInput> = z.lazy(() =>
  z.object({
    slug: slugSchema,
    parentSlug: z.string().nullable().optional(),
    isActive: z.boolean().optional(),
    commissionRate: z.number().min(0).max(100).optional(),
    translations: translationRecordSchema,
    children: z.array(categoryNodeSchema).optional(),
  }),
);

const importRootSchema = z.object({
  items: z.array(categoryNodeSchema).min(1, "Add at least one category"),
});

type FlatCategory = {
  ref: string;
  slug: string;
  parentSlug: string | null;
  depth: number;
  nameEn: string;
  nameBn: string;
  isActive: boolean;
};

function flattenForPreview(
  items: BulkImportCategoryInput[],
  parentSlug: string | null = null,
  depth = 0,
  parentRef = "items",
): FlatCategory[] {
  const flat: FlatCategory[] = [];
  const hasNestedChildren = items.some((item) => (item.children?.length ?? 0) > 0);
  const hasExplicitParentSlugs = items.some(
    (item) => item.parentSlug !== undefined && item.parentSlug !== null,
  );

  if (!hasNestedChildren && hasExplicitParentSlugs) {
    return items.map((item, index) => ({
      ref: `items[${index}]`,
      slug: item.slug,
      parentSlug: item.parentSlug ?? null,
      depth: 0,
      nameEn: item.translations.en.name,
      nameBn: item.translations.bn?.name?.trim() || "—",
      isActive: item.isActive ?? false,
    }));
  }

  items.forEach((item, index) => {
    const ref =
      parentRef === "items" ? `items[${index}]` : `${parentRef}.children[${index}]`;
    const resolvedParent =
      item.parentSlug === undefined ? parentSlug : item.parentSlug;

    flat.push({
      ref,
      slug: item.slug,
      parentSlug: resolvedParent,
      depth,
      nameEn: item.translations.en.name,
      nameBn: item.translations.bn?.name?.trim() || "—",
      isActive: item.isActive ?? false,
    });

    if (item.children?.length) {
      flat.push(...flattenForPreview(item.children, item.slug, depth + 1, ref));
    }
  });

  return flat;
}

function assignDepths(nodes: FlatCategory[]): FlatCategory[] {
  const bySlug = new Map(nodes.map((node) => [node.slug, node]));
  const depthBySlug = new Map<string, number>();

  const resolveDepth = (node: FlatCategory): number => {
    const cached = depthBySlug.get(node.slug);
    if (cached !== undefined) return cached;
    if (!node.parentSlug) {
      depthBySlug.set(node.slug, 0);
      return 0;
    }
    const parent = bySlug.get(node.parentSlug);
    const depth = parent ? resolveDepth(parent) + 1 : 0;
    depthBySlug.set(node.slug, depth);
    return depth;
  };

  return nodes.map((node) => ({ ...node, depth: resolveDepth(node) }));
}

export function parseCategoryImportJson(raw: string): {
  payload?: BulkImportCategoryInput[];
  parseError?: string;
} {
  try {
    const parsed = JSON.parse(raw) as unknown;
    const result = importRootSchema.safeParse(parsed);
    if (!result.success) {
      const issue = result.error.issues[0];
      const path = issue.path.length > 0 ? `${issue.path.join(".")}: ` : "";
      return { parseError: `${path}${issue.message}` };
    }
    return { payload: result.data.items };
  } catch (error) {
    if (error instanceof SyntaxError) {
      return { parseError: `Invalid JSON: ${error.message}` };
    }
    return { parseError: "Invalid JSON payload" };
  }
}

export function buildPreviewRows(items: BulkImportCategoryInput[]): PreviewCategoryRow[] {
  const flat = assignDepths(flattenForPreview(items));
  const slugCounts = new Map<string, number>();
  flat.forEach((node) => slugCounts.set(node.slug, (slugCounts.get(node.slug) ?? 0) + 1));
  const slugToName = new Map(flat.map((node) => [node.slug, node.nameEn]));

  return flat.map((node) => {
    const errors: string[] = [];
    if (!node.nameEn.trim()) errors.push("English name is required");
    if ((slugCounts.get(node.slug) ?? 0) > 1) errors.push("Duplicate slug in this import");
    if (node.depth > 2) errors.push("Exceeds maximum depth of 3 levels");

    let warningMessage: string | undefined;
    if (!node.nameBn || node.nameBn === "—") {
      warningMessage = "Bengali name missing — import will still work with English only";
    }
    if (node.parentSlug && !slugToName.has(node.parentSlug)) {
      warningMessage = warningMessage
        ? `${warningMessage}; Parent '${node.parentSlug}' will be resolved against existing categories on save`
        : `Parent '${node.parentSlug}' will be resolved against existing categories on save`;
    }

    const parentPath = node.parentSlug
      ? slugToName.get(node.parentSlug) ?? node.parentSlug
      : "Root";

    return {
      ref: node.ref,
      slug: node.slug,
      parentSlug: node.parentSlug,
      parentPath,
      depth: node.depth,
      nameEn: node.nameEn,
      nameBn: node.nameBn,
      isActive: node.isActive,
      status: errors.length > 0 ? "error" : warningMessage ? "warning" : "ready",
      message: errors.length > 0 ? errors.join("; ") : warningMessage,
    } satisfies PreviewCategoryRow;
  });
}

export function countPreviewStatus(rows: PreviewCategoryRow[]) {
  let ready = 0;
  let warnings = 0;
  let errors = 0;

  for (const row of rows) {
    if (row.status === "error") errors += 1;
    else if (row.status === "warning") warnings += 1;
    else ready += 1;
  }

  return { ready, warnings, errors };
}

export function buildImportPayload(
  items: BulkImportCategoryInput[],
  options: BulkImportCategoriesPayload["options"],
): BulkImportCategoriesPayload {
  return { items, options };
}
