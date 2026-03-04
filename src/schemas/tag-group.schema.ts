import { z } from "zod";

export const createTagGroupSchema = z.object({
    name: z.string().min(1, "Group name is required").max(255, "Name must be less than 255 characters"),
    description: z.string().max(1000, "Description must be less than 1000 characters").optional(),
    isActive: z.boolean().default(true),
    tags: z.array(z.string()).min(1, "At least one tag is required").default([]),
});

export const updateTagGroupSchema = z.object({
    isActive: z.boolean().default(true),
});

export type CreateTagGroupFormData = z.infer<typeof createTagGroupSchema>;
export type UpdateTagGroupFormData = z.infer<typeof updateTagGroupSchema>;
