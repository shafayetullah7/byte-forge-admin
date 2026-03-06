import { z } from "zod";

const translationSchema = z.object({
    locale: z.enum(["en", "bn"]),
    name: z.string().min(1, "Name is required").max(255),
    description: z.string().max(1000).optional(),
});

const translationsArraySchema = z.array(translationSchema)
    .min(2, "Both English and Bengali translations are required")
    .max(2)
    .superRefine((val, ctx) => {
        const locales = val.map(t => t.locale);
        if (!locales.includes("en")) ctx.addIssue({ code: "custom", message: "English translation missing" });
        if (!locales.includes("bn")) ctx.addIssue({ code: "custom", message: "Bengali translation missing" });
    });

export const createTagGroupSchema = z.object({
    slug: z.string().min(1, "Slug is required").max(255),
    isActive: z.boolean().default(true),
    translations: translationsArraySchema,
    tags: z.array(z.object({
        slug: z.string().min(1, "Tag slug is required"),
        translations: translationsArraySchema,
        isActive: z.boolean().default(true),
    })).default([]),
});

export const updateTagGroupSchema = z.object({
    slug: z.string().min(1, "Slug is required").max(255).optional(),
    isActive: z.boolean().default(true),
    nameEn: z.string().min(1, "English name is required").max(255).optional(),
    nameBn: z.string().min(1, "Bengali name is required").max(255).optional(),
});

export type CreateTagGroupFormData = z.infer<typeof createTagGroupSchema>;
export type UpdateTagGroupFormData = z.infer<typeof updateTagGroupSchema>;
