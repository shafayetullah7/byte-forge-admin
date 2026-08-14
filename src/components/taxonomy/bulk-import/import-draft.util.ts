type CategoryDraft = {
  rawJson?: string;
  items?: unknown[];
  step?: string;
};

type TagDraft = {
  rawJson?: string;
  groups?: unknown[];
  step?: string;
};

export function isMeaningfulCategoryImportDraft(draft: CategoryDraft): boolean {
  if (draft.step && draft.step !== "paste" && draft.step !== "result") return true;
  if (draft.rawJson?.trim()) return true;
  return (draft.items?.length ?? 0) > 0;
}

export function isMeaningfulTagImportDraft(draft: TagDraft): boolean {
  if (draft.step && draft.step !== "paste" && draft.step !== "result") return true;
  if (draft.rawJson?.trim()) return true;
  return (draft.groups?.length ?? 0) > 0;
}
