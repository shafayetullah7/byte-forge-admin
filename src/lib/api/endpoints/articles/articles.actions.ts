"use action";

import { action, revalidate } from "@solidjs/router";
import { apiClient } from "../../api-client";
import type { AdminArticleDetail } from "./articles.types";

function revalidateArticleCaches(articleId?: string) {
  revalidate("admin-articles");
  if (articleId) {
    revalidate(["admin-article-detail", articleId]);
  } else {
    revalidate("admin-article-detail");
  }
}

export const approveAdminArticle = action(async (articleId: string) => {
  await apiClient<AdminArticleDetail>(`/admin/articles/${articleId}/approve`, {
    method: "POST",
  });
  revalidateArticleCaches(articleId);
}, "approve-admin-article");

export const rejectAdminArticle = action(
  async (input: { articleId: string; reason: string }) => {
    await apiClient<AdminArticleDetail>(
      `/admin/articles/${input.articleId}/reject`,
      {
        method: "POST",
        body: JSON.stringify({ reason: input.reason }),
      },
    );
    revalidateArticleCaches(input.articleId);
  },
  "reject-admin-article",
);

export const setAdminArticleEditorsPick = action(
  async (input: { articleId: string; isEditorsPick: boolean }) => {
    await apiClient<AdminArticleDetail>(
      `/admin/articles/${input.articleId}/editors-pick`,
      {
        method: "PATCH",
        body: JSON.stringify({ isEditorsPick: input.isEditorsPick }),
      },
    );
    revalidateArticleCaches(input.articleId);
  },
  "set-admin-article-editors-pick",
);
