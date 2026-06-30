import { query } from "@solidjs/router";
import { apiClient } from "../../api-client";
import type {
  AdminCampaignDetail,
  AdminCampaignFilter,
  AdminCampaignListResponse,
} from "./campaigns.types";

const BASE_PATH = "/admin/campaigns";

export const getAdminCampaigns = query(async (filter?: AdminCampaignFilter) => {
  const params: Record<string, string | number | boolean | undefined> = {};
  if (filter) {
    if (filter.page !== undefined) params.page = filter.page;
    if (filter.limit !== undefined) params.limit = filter.limit;
    if (filter.search !== undefined) params.search = filter.search;
    if (filter.moderationStatus !== undefined) {
      params.moderationStatus = filter.moderationStatus;
    }
  }

  return apiClient<AdminCampaignListResponse>(BASE_PATH, {
    params,
    unwrapData: false,
  });
}, "admin-campaigns");

export const getAdminCampaign = query(async (campaignId: string) => {
  return apiClient<AdminCampaignDetail>(`${BASE_PATH}/${campaignId}`);
}, "admin-campaign-detail");
