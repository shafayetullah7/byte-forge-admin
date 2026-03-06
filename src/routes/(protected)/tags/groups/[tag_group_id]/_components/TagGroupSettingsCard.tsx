import { createSignal, Show, createEffect, type JSX } from "solid-js";
import { createForm, setValue } from "@modular-forms/solid";
import { Button } from "~/components/ui/Button";
import { Input } from "~/components/ui/Input";
import { Card } from "~/components/ui/Card";
import type { TagGroup, TagGroupTranslation } from "~/lib/api/endpoints/tag-groups/tag-groups.types";
import { updateTagGroupSchema, type UpdateTagGroupFormData } from "~/schemas/tag-group.schema";
import { slugify } from "~/lib/utils/slugify";

interface TagGroupSettingsCardProps {
    group: TagGroup;
    translations: TagGroupTranslation[];
    onSave: (values: UpdateTagGroupFormData) => Promise<void>;
    isSaving: boolean;
    onCancel?: () => void;
}

export function TagGroupSettingsCard(props: TagGroupSettingsCardProps) {
    const [isSlugManual, setIsSlugManual] = createSignal(true);

    // Derive initial names from translations
    const initialNameEn = () => props.translations.find(t => t.locale === "en")?.name || "";
    const initialNameBn = () => props.translations.find(t => t.locale === "bn")?.name || "";

    const [form, { Form, Field }] = createForm<UpdateTagGroupFormData>({
        initialValues: {
            slug: props.group.slug || "",
            isActive: props.group.isActive,
            nameEn: initialNameEn(),
            nameBn: initialNameBn()
        },
        validate: (values) => {
            const result = updateTagGroupSchema.safeParse(values);
            if (result.success) return {};
            const errors: Record<string, string> = {};
            result.error.issues.forEach((issue) => {
                if (issue.path.length > 0) {
                    errors[issue.path.join(".")] = issue.message;
                }
            });
            return errors;
        }
    });

    // Keep form in sync if props change (e.g. after a successful save or external update)
    createEffect(() => {
        setValue(form, "nameEn", initialNameEn());
        setValue(form, "nameBn", initialNameBn());
        setValue(form, "slug", props.group.slug || "");
        setValue(form, "isActive", props.group.isActive);
    });

    return (
        <Form onSubmit={props.onSave} class="space-y-6">
            <Card class="p-5 border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <h3 class="text-sm font-bold text-slate-800 mb-5 uppercase tracking-wider">Group Settings</h3>
                <div class="space-y-4">
                    <Field name="nameEn">
                        {(field, fieldProps) => (
                            <Input
                                {...fieldProps}
                                label="Group Name (English) *"
                                placeholder="e.g. Light Requirements"
                                value={field.value}
                                error={field.error}
                                disabled={props.isSaving}
                                onInput={(e) => {
                                    const val = (e.currentTarget as HTMLInputElement).value;
                                    setValue(form, "nameEn", val);
                                    if (!isSlugManual()) {
                                        setValue(form, "slug", slugify(val));
                                    }
                                }}
                            />
                        )}
                    </Field>

                    <Field name="nameBn">
                        {(field, fieldProps) => (
                            <Input
                                {...fieldProps}
                                label="Group Name (Bengali) *"
                                placeholder="e.g. আলোকসজ্জা"
                                value={field.value}
                                error={field.error}
                                disabled={props.isSaving}
                            />
                        )}
                    </Field>

                    <Field name="slug">
                        {(field, fieldProps) => (
                            <Input
                                {...fieldProps}
                                label="Slug *"
                                placeholder="e.g. light-requirements"
                                value={field.value}
                                error={field.error}
                                maxLength={255}
                                disabled={props.isSaving}
                                onInput={(e) => {
                                    setValue(form, "slug", (e.currentTarget as HTMLInputElement).value);
                                    setIsSlugManual(true);
                                }}
                            />
                        )}
                    </Field>

                    <Field name="isActive" type="boolean">
                        {(field, fieldProps) => (
                            <div class="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                                <div>
                                    <p class="text-xs font-bold text-slate-800">Active Status</p>
                                    <p class="text-[10px] text-slate-500 mt-0.5">Visible globally</p>
                                </div>
                                <label class="relative inline-flex items-center cursor-pointer">
                                    <input
                                        {...fieldProps}
                                        type="checkbox"
                                        class="sr-only peer"
                                        checked={!!field.value}
                                        disabled={props.isSaving}
                                    />
                                    <div class="w-10 h-5.5 bg-slate-200 rounded-full peer peer-checked:after:translate-x-4.5 peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-primary-green-600"></div>
                                </label>
                            </div>
                        )}
                    </Field>
                </div>
            </Card>

            <div class="flex justify-end gap-3">
                <Show when={props.onCancel}>
                    <Button
                        type="button"
                        variant="outline"
                        size="md"
                        onClick={props.onCancel}
                        disabled={props.isSaving}
                    >
                        Cancel
                    </Button>
                </Show>
                <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    isLoading={props.isSaving}
                    disabled={form.invalid || !form.dirty}
                >
                    Save Changes
                </Button>
            </div>
        </Form>
    );
}
