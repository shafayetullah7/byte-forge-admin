import { z } from "zod";
import { slugify } from "~/lib/utils/slugify";
import type {
  BulkImportTagGroupInput,
  BulkImportTagGroupsPayload,
  PreviewGroupRow,
  PreviewTagRow,
} from "~/lib/api/endpoints/tag-groups/tag-groups-bulk-import.types";

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
  bn: z.object({
    name: z.string().trim().min(1, "Bengali name is required").max(255),
    description: z.string().optional().nullable(),
  }),
});

const tagSchema = z.object({
  slug: slugSchema,
  isActive: z.boolean().optional(),
  translations: translationRecordSchema,
});

const groupSchema = z.object({
  slug: slugSchema,
  isActive: z.boolean().optional(),
  existing: z.boolean().optional(),
  translations: translationRecordSchema.optional(),
  tags: z.array(tagSchema).optional().default([]),
});

const importRootSchema = z.object({
  groups: z.array(groupSchema).min(1, "Add at least one tag group"),
});

export function parseTagImportJson(raw: string): {
  payload?: BulkImportTagGroupsPayload["groups"];
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
    return { payload: result.data };
  } catch (error) {
    if (error instanceof SyntaxError) {
      return { parseError: `Invalid JSON: ${error.message}` };
    }
    return { parseError: "Invalid JSON payload" };
  }
}

export function buildPreviewRows(groups: BulkImportTagGroupInput[]): PreviewGroupRow[] {
  const tagSlugs = new Set<string>();

  return groups.map((group, groupIndex) => {
    const groupRef = `groups[${groupIndex}]`;
    const groupErrors: string[] = [];

    if (!group.existing && !group.translations) {
      groupErrors.push("New groups require EN and BN translations");
    }

    const tags: PreviewTagRow[] = (group.tags ?? []).map((tag, tagIndex) => {
      const ref = `${groupRef}.tags[${tagIndex}]`;
      const errors: string[] = [];

      if (!tag.translations?.en?.name?.trim()) {
        errors.push("English name is required");
      }
      if (!tag.translations?.bn?.name?.trim()) {
        errors.push("Bengali name is required");
      }
      if (tagSlugs.has(tag.slug)) {
        errors.push("Duplicate tag slug in this import");
      }
      tagSlugs.add(tag.slug);

      return {
        ref,
        groupSlug: group.slug,
        slug: tag.slug,
        nameEn: tag.translations.en.name,
        nameBn: tag.translations.bn.name,
        isActive: tag.isActive ?? true,
        status: errors.length > 0 ? "error" : "ready",
        message: errors.join("; "),
      } satisfies PreviewTagRow;
    });

    const groupSlugSet = groups.filter((item) => item.slug === group.slug).length;
    if (groupSlugSet > 1) {
      groupErrors.push("Duplicate group slug in this import");
    }

    return {
      ref: groupRef,
      slug: group.slug,
      nameEn: group.translations?.en.name ?? "—",
      nameBn: group.translations?.bn.name ?? "—",
      isActive: group.isActive ?? true,
      existing: group.existing === true,
      status: groupErrors.length > 0 ? "error" : "ready",
      message: groupErrors.join("; "),
      tags,
    } satisfies PreviewGroupRow;
  });
}

export function countPreviewStatus(rows: PreviewGroupRow[]) {
  let ready = 0;
  let errors = 0;

  for (const group of rows) {
    if (group.status === "error") errors += 1;
    else ready += 1;

    for (const tag of group.tags) {
      if (tag.status === "error") errors += 1;
      else ready += 1;
    }
  }

  return { ready, errors };
}

export function buildImportPayload(
  groups: BulkImportTagGroupInput[],
  options: BulkImportTagGroupsPayload["options"],
): BulkImportTagGroupsPayload {
  return { groups, options };
}

export function suggestSlugFromName(name: string): string {
  return slugify(name);
}
