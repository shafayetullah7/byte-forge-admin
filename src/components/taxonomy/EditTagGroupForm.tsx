import { createSignal, Show, createEffect, type JSX } from "solid-js";
import { useNavigate, useSubmission, useAction } from "@solidjs/router";
import { createForm, setValue } from "@modular-forms/solid";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Card } from "../ui/Card";
import { FormHeader } from "./FormHeader";
import { updateTagGroup } from "~/lib/api/endpoints/tag-groups/tag-groups.actions";
import type { TagGroup } from "~/lib/api/endpoints/tag-groups/tag-groups.types";
import { updateTagGroupSchema, type UpdateTagGroupFormData } from "~/schemas/tag-group.schema";

interface EditTagGroupFormProps {
    group: TagGroup;
    children?: JSX.Element;
    hideHeader?: boolean;
}

export function EditTagGroupForm(props: EditTagGroupFormProps) {
    const navigate = useNavigate();
    const updateTrigger = useAction(updateTagGroup);
    const submission = useSubmission(updateTagGroup);
    const [isSlugManual, setIsSlugManual] = createSignal(true);

    const [tagGroupForm, { Form, Field }] = createForm<UpdateTagGroupFormData>({
        initialValues: {
            slug: props.group.slug || "",
            isActive: props.group.isActive
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

    const isPending = () => !!submission.pending;

    const handleSubmit = (values: UpdateTagGroupFormData) => {
        updateTrigger(props.group.id, {
            slug: values.slug?.trim(),
            isActive: values.isActive,
        });
    };

    createEffect(() => {
        if (submission.result) {
            navigate(`/tags/groups/${props.group.id}`);
        }
    });

    return (
        <div class={props.hideHeader ? "" : "px-6 py-8"}>
            <Form onSubmit={handleSubmit} class="space-y-6">
                <Show when={!props.hideHeader}>
                    <FormHeader
                        title={`Edit: ${props.group.name || "Untitled Group"}`}
                        subtitle="Modify group settings and active status."
                        backHref={`/tags/groups/${props.group.id}`}
                        backLabel="Back to Tag Group"
                    />
                </Show>

                <Card class="p-5 border-slate-200">
                    <h3 class="text-sm font-bold text-slate-800 mb-5 uppercase tracking-wider">Group Settings</h3>
                    <div class="space-y-4">
                        <Field name="slug">
                            {(field, fieldProps) => (
                                <Input
                                    {...fieldProps}
                                    label="Slug *"
                                    placeholder="e.g. light-requirements"
                                    value={field.value}
                                    error={field.error}
                                    maxLength={255}
                                    disabled={isPending()}
                                    onInput={(e) => {
                                        setValue(tagGroupForm, "slug", (e.currentTarget as HTMLInputElement).value);
                                        setIsSlugManual(true);
                                    }}
                                />
                            )}
                        </Field>

                        <Field name="isActive" type="boolean">
                            {(field, fieldProps) => (
                                <div class="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 bg-slate-50/50">
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
                                            disabled={isPending()}
                                        />
                                        <div class="w-10 h-5.5 bg-slate-200 rounded-full peer peer-checked:after:translate-x-4.5 peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-primary-green-600"></div>
                                    </label>
                                </div>
                            )}
                        </Field>
                    </div>
                </Card>

                {/* Additional children content (like tags management) */}
                <Show when={props.children}>
                    {props.children}
                </Show>

                <Show when={submission.error}>
                    <div class="p-4 rounded-xl bg-red-50 border border-red-100 text-sm text-red-700 flex gap-3">
                        <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {submission.error.message || "Failed to update tag group."}
                    </div>
                </Show>

                <div class="flex justify-end gap-3 pt-4">
                    <Button
                        type="button"
                        variant="outline"
                        size="md"
                        onClick={() => navigate(`/tags/groups/${props.group.id}`)}
                        disabled={isPending()}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        size="md"
                        isLoading={isPending()}
                    >
                        Save Changes
                    </Button>
                </div>
            </Form>
        </div>
    );
}
