import { apiClient } from "../../api-client";
import type { Language } from "./languages.types";

export async function getLanguages(): Promise<Language[]> {
  return apiClient<Language[]>("/admin/languages");
}
