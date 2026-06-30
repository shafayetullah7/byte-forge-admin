"use action";

import { action, revalidate } from "@solidjs/router";
import { apiClient } from "../../api-client";
import type { AdminCampaignDetail } from "./campaigns.types";

function revalidateCampaignCaches(campaignId?: string) {
  revalidate("admin-campaigns");
  if (campaignId) {
    revalidate(["admin-campaign-detail", campaignId]);
  } else {
    revalidate("admin-campaign-detail");
  }
}

export const approveAdminCampaign = action(async (campaignId: string) => {
  await apiClient<AdminCampaignDetail>(`/admin/campaigns/${campaignId}/approve`, {
    method: "POST",
  });
  revalidateCampaignCaches(campaignId);
}, "approve-admin-campaign");

export const rejectAdminCampaign = action(
  async (input: { campaignId: string; reason: string }) => {
    await apiClient<AdminCampaignDetail>(
      `/admin/campaigns/${input.campaignId}/reject`,
      {
        method: "POST",
        body: JSON.stringify({ reason: input.reason }),
      },
    );
    revalidateCampaignCaches(input.campaignId);
  },
  "reject-admin-campaign",
);
