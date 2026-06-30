import { query } from "@solidjs/router";
import { apiClient } from "../../api-client";
import type {
  AdminArticleDetail,
  AdminArticleFilter,
  AdminArticleListResponse,
} from "./articles.types";

const BASE_PATH = "/admin/articles";

export const getAdminArticles = query(async (filter?: AdminArticleFilter) => {
  const params: Record<string, string | number | boolean | undefined> = {};
  if (filter) {
    if (filter.page !== undefined) params.page = filter.page;
    if (filter.limit !== undefined) params.limit = filter.limit;
    if (filter.search !== undefined) params.search = filter.search;
    if (filter.moderationStatus !== undefined) {
      params.moderationStatus = filter.moderationStatus;
    }
  }

  return apiClient<AdminArticleListResponse>(BASE_PATH, {
    params,
    unwrapData: false,
  });
}, "admin-articles");

export const getAdminArticle = query(async (articleId: string) => {
  return apiClient<AdminArticleDetail>(`${BASE_PATH}/${articleId}`);
}, "admin-article-detail");
