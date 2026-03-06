import { For, createSignal, Show, createEffect, type JSX } from "solid-js";
import { createStore } from "solid-js/store";
import { useNavigate, useSubmission, useAction } from "@solidjs/router";
import { createForm, setError, setValue, getValue } from "@modular-forms/solid";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Card } from "../ui/Card";
import { ArrowLeftIcon } from "../icons/ArrowLeftIcon";
import { A } from "@solidjs/router";
import { createTagGroup, updateTagGroup } from "~/lib/api/endpoints/tag-groups/tag-groups.actions";
import type { TagGroup } from "~/lib/api/endpoints/tag-groups/tag-groups.types";
import { slugify } from "~/lib/utils/slugify";
import { createTagGroupSchema, updateTagGroupSchema, type CreateTagGroupFormData, type UpdateTagGroupFormData } from "~/schemas/tag-group.schema";

// ─── Shared Styles/Components ────────────────────────────────────────────────

function FormHeader(props: {
    title: string;
    subtitle?: string;
    isSubmitting: boolean;
    onCancel: () => void;
    onSubmit: () => void;
    submitLabel: string;
    backHref?: string;
    backLabel?: string;
}) {
    return (
        <div class="mb-8">
            <Show when={props.backHref}>
                <A
                    href={props.backHref!}
                    class="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-primary-green-700 transition-colors mb-4"
                >
                    <ArrowLeftIcon width="16" height="16" />
                    {props.backLabel || "Back"}
                </A>
            </Show>
            <div class="flex items-center justify-between">
                <div>
                    <h1 class="text-2xl font-bold text-slate-900">{props.title}</h1>
                    <Show when={props.subtitle}>
                        <p class="text-sm text-slate-500 mt-1">{props.subtitle}</p>
                    </Show>
                </div>
                <div class="flex gap-3">
                    <Button variant="outline" size="md" onClick={props.onCancel} disabled={props.isSubmitting}>
                        Cancel
                    </Button>
                    <Button variant="primary" size="md" onClick={props.onSubmit} isLoading={props.isSubmitting}>
                        {props.submitLabel}
                    </Button>
                </div>
            </div>
        </div>
    );
}

// ─── Create Form ──────────────────────────────────────────────────────────────

interface CreateTagGroupFormProps {
    hideHeader?: boolean;
}

export function CreateTagGroupForm(props: CreateTagGroupFormProps = {}) {
    const navigate = useNavigate();
    const createTrigger = useAction(createTagGroup);
    const submission = useSubmission(createTagGroup);

    const [tagInput, setTagInput] = createSignal("");
    const [tagInputBn, setTagInputBn] = createSignal("");
    const [tagSlugInput, setTagSlugInput] = createSignal("");
    const [isTagSlugManual, setIsTagSlugManual] = createSignal(false);

    const [isSlugManual, setIsSlugManual] = createSignal(false);

    const [tagGroupForm, { Form, Field, FieldArray }] = createForm<CreateTagGroupFormData>({
        initialValues: {
            slug: "",
            isActive: true,
            translations: [
                { locale: "en", name: "", description: "" },
                { locale: "bn", name: "", description: "" }
            ],
            tags: []
        },
        validate: (values) => {
            const result = createTagGroupSchema.safeParse(values);
            if (result.success) return {};
            const errors: Record<string, string> = {};
            result.error.issues.forEach((issue: any) => {
                if (issue.path.length > 0) {
                    errors[(issue.path as string[]).join(".")] = issue.message;
                }
            });
            return errors;
        }
    });

    const handleTagInput = (e: Event) => {
        const val = (e.currentTarget as HTMLInputElement).value;
        setTagInput(val);
        if (!isTagSlugManual() && val) {
            setTagSlugInput(slugify(val));
        } else if (!isTagSlugManual() && !val) {
            setTagSlugInput("");
        }
    };

    const handleTagSlugInput = (e: Event) => {
        setTagSlugInput((e.currentTarget as HTMLInputElement).value);
        setIsTagSlugManual(true);
    };

    const handleAddTag = () => {
        const nameEn = tagInput().trim();
        const nameBn = tagInputBn().trim();
        const slugVal = tagSlugInput().trim();
        const currentTags = (getValue(tagGroupForm, "tags" as any) || []) as any[];

        if (nameEn !== '' && nameBn !== '' && slugVal !== '' && !currentTags.some(t => t.slug === slugVal)) {
            setValue(tagGroupForm, "tags" as any, [...currentTags, {
                slug: slugVal,
                isActive: true,
                translations: [
                    { locale: "en", name: nameEn },
                    { locale: "bn", name: nameBn }
                ]
            }]);
            setTagInput("");
            setTagInputBn("");
            setTagSlugInput("");
            setIsTagSlugManual(false);
        }
    };

    const handleRemoveTag = (tagToRemoveSlug: string) => {
        const currentTags: { name: string, slug: string }[] = (getValue(tagGroupForm, "tags" as any) || []) as { name: string, slug: string }[];
        setValue(tagGroupForm, "tags" as any, currentTags.filter(t => t.slug !== tagToRemoveSlug));
    };

    const handleSubmit = (values: CreateTagGroupFormData) => {
        createTrigger(values);
    };

    // Redirect on success
    createEffect(() => {
        if (submission.result) {
            navigate("/tags");
        }
    });

    const isPending = () => !!submission.pending;

    return (
        <div class={props.hideHeader ? "" : "px-6 py-8 mx-auto max-w-[1400px]"}>
            <Show when={!props.hideHeader}>
                <FormHeader
                    title="Create Tag Group"
                    subtitle="Define a new classification group for entity tagging."
                    isSubmitting={isPending()}
                    onCancel={() => navigate("/tags")}
                    onSubmit={() => {
                        const formElement = document.getElementById("create-tag-group-form") as HTMLFormElement;
                        formElement?.requestSubmit();
                    }}
                    submitLabel="Create Group"
                    backHref="/tags"
                    backLabel="Back to Library"
                />
            </Show>

            <Form id="create-tag-group-form" onSubmit={handleSubmit} class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Metadata Column */}
                <aside class="lg:col-span-1 space-y-6">
                    <Card class="p-6">
                        <h3 class="text-base font-semibold text-slate-900 mb-6">Group Information</h3>
                        <div class="space-y-5">
                            <Field name="translations.0.name">
                                {(field, props) => {
                                    const handleNameChange = (e: Event) => {
                                        const newName = (e.currentTarget as HTMLInputElement).value;
                                        setValue(tagGroupForm, "translations.0.name", newName);

                                        if (!isSlugManual() && newName) {
                                            setValue(tagGroupForm, "slug", slugify(newName));
                                        } else if (!isSlugManual() && !newName) {
                                            setValue(tagGroupForm, "slug", "");
                                        }
                                    };

                                    return (
                                        <Input
                                            {...props}
                                            label="Group Name (English) *"
                                            placeholder="e.g. Light Requirements"
                                            value={field.value}
                                            error={field.error}
                                            maxLength={255}
                                            disabled={isPending()}
                                            onInput={handleNameChange}
                                        />
                                    );
                                }}
                            </Field>

                            <Field name="translations.1.name">
                                {(field, props) => (
                                    <Input
                                        {...props}
                                        label="Group Name (Bengali) *"
                                        placeholder="e.g. আলোর প্রয়োজনীয়তা"
                                        value={field.value}
                                        error={field.error}
                                        maxLength={255}
                                        disabled={isPending()}
                                    />
                                )}
                            </Field>

                            <Field name="slug">
                                {(field, props) => {
                                    const handleSlugChange = (e: Event) => {
                                        setValue(tagGroupForm, "slug", (e.currentTarget as HTMLInputElement).value);
                                        setIsSlugManual(true);
                                    };

                                    return (
                                        <Input
                                            {...props}
                                            label="Slug *"
                                            placeholder="e.g. light-requirements"
                                            value={field.value}
                                            error={field.error}
                                            maxLength={255}
                                            disabled={isPending()}
                                            onInput={handleSlugChange}
                                        />
                                    );
                                }}
                            </Field>

                            <div class="grid grid-cols-1 gap-5">
                                <Field name="translations.0.description">
                                    {(field, props) => (
                                        <div class="space-y-2">
                                            <label for="group-description-en" class="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                                                Description (English)
                                            </label>
                                            <textarea
                                                {...props}
                                                id="group-description-en"
                                                rows={3}
                                                class={`block w-full rounded-lg border bg-white px-3 py-2.5 text-sm ring-offset-white transition-all focus:border-primary-green-500 focus:outline-none focus:ring-2 focus:ring-primary-green-500/20 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500 ${field.error ? "border-red-500" : "border-slate-200"}`}
                                                placeholder="English description..."
                                                value={field.value || ""}
                                                maxLength={1000}
                                                disabled={isPending()}
                                            />
                                        </div>
                                    )}
                                </Field>

                                <Field name="translations.1.description">
                                    {(field, props) => (
                                        <div class="space-y-2">
                                            <label for="group-description-bn" class="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                                                Description (Bengali)
                                            </label>
                                            <textarea
                                                {...props}
                                                id="group-description-bn"
                                                rows={3}
                                                class={`block w-full rounded-lg border bg-white px-3 py-2.5 text-sm ring-offset-white transition-all focus:border-primary-green-500 focus:outline-none focus:ring-2 focus:ring-primary-green-500/20 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500 ${field.error ? "border-red-500" : "border-slate-200"}`}
                                                placeholder="Bengali description..."
                                                value={field.value || ""}
                                                maxLength={1000}
                                                disabled={isPending()}
                                            />
                                        </div>
                                    )}
                                </Field>
                            </div>

                            <Field name="isActive" type="boolean">
                                {(field, props) => (
                                    <div class="flex items-center justify-between p-4 rounded-lg border border-slate-100 bg-slate-50/50">
                                        <div>
                                            <p class="text-sm font-medium text-slate-900">Active Status</p>
                                            <p class="text-xs text-slate-500 mt-0.5">Visible globally when enabled.</p>
                                        </div>
                                        <label class="relative inline-flex items-center cursor-pointer">
                                            <input
                                                {...props}
                                                type="checkbox"
                                                class="sr-only peer"
                                                checked={!!field.value}
                                                disabled={isPending()}
                                            />
                                            <div class="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-green-600"></div>
                                        </label>
                                    </div>
                                )}
                            </Field>
                        </div>
                    </Card>

                    <Show when={submission.error}>
                        <div class="p-4 rounded-xl bg-red-50 border border-red-100 text-sm text-red-700 flex gap-3">
                            <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {submission.error.message || "Failed to create tag group."}
                        </div>
                    </Show>
                </aside>

                {/* Operations Column */}
                <main class="lg:col-span-2 space-y-6">
                    <Card class="p-6">
                        <div class="flex items-start justify-between mb-8">
                            <div>
                                <h3 class="text-base font-semibold text-slate-900">Manage Tags</h3>
                                <p class="text-sm text-slate-500 mt-1">
                                    Add specific tag values that belong to this group.
                                </p>
                            </div>
                            <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-primary-green-50 text-primary-green-700 border border-primary-green-100">
                                {(getValue(tagGroupForm, "tags" as any) as any[])?.length || 0} Tags
                            </span>
                        </div>

                        <div class="space-y-6">
                            <div class="flex flex-col gap-4">
                                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <Input
                                        label="Tag Name (English) *"
                                        placeholder="e.g. High"
                                        value={tagInput()}
                                        onInput={handleTagInput}
                                        maxLength={255}
                                        disabled={isPending()}
                                    />
                                    <Input
                                        label="Tag Name (Bengali) *"
                                        placeholder="e.g. উচ্চ"
                                        value={tagInputBn()}
                                        onInput={(e) => setTagInputBn(e.currentTarget.value)}
                                        maxLength={255}
                                        disabled={isPending()}
                                    />
                                </div>
                                <div class="flex flex-col sm:flex-row gap-3 items-end">
                                    <div class="w-full sm:flex-1">
                                        <Input
                                            label="Tag Slug *"
                                            placeholder="e.g. high"
                                            value={tagSlugInput()}
                                            onInput={handleTagSlugInput}
                                            maxLength={255}
                                            disabled={isPending()}
                                        />
                                    </div>
                                    <Button
                                        variant="secondary"
                                        onClick={handleAddTag}
                                        disabled={!tagInput().trim() || !tagInputBn().trim() || !tagSlugInput().trim() || isPending()}
                                        class="h-11 w-full sm:w-auto"
                                    >
                                        Add Tag
                                    </Button>
                                </div>
                            </div>

                            <FieldArray name="tags">
                                {(fieldArray) => (
                                    <div class={`p-6 rounded-xl border border-dashed bg-slate-50/50 min-h-[200px] flex flex-wrap gap-2.5 content-start ${fieldArray.error ? "border-red-500 bg-red-50/10" : "border-slate-200"}`}>
                                        <Show
                                            when={fieldArray.items.length > 0}
                                            fallback={
                                                <div class="w-full flex flex-col items-center justify-center text-slate-400 py-8">
                                                    <p class="text-sm font-medium">No tags added yet</p>
                                                    <Show when={fieldArray.error}>
                                                        <p class="text-xs font-medium text-red-500 mt-2">{fieldArray.error}</p>
                                                    </Show>
                                                </div>
                                            }
                                        >
                                            <For each={fieldArray.items}>
                                                {(item, index) => (
                                                    <div class="inline-flex flex-col gap-1 pl-3 pr-2 py-2 rounded-lg bg-white border border-slate-200 shadow-sm transition-all hover:border-primary-green-300">
                                                        <div class="flex items-center justify-between gap-3">
                                                            <div class="flex flex-col">
                                                                <span class="text-sm font-semibold text-slate-700">{getValue(tagGroupForm, `tags.${index()}.translations.0.name` as any)}</span>
                                                                <span class="text-xs text-slate-500 font-medium">{getValue(tagGroupForm, `tags.${index()}.translations.1.name` as any)}</span>
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleRemoveTag(getValue(tagGroupForm, `tags.${index()}.slug` as any) as string)}
                                                                class="w-5 h-5 rounded flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                                                                disabled={isPending()}
                                                            >
                                                                ✕
                                                            </button>
                                                        </div>
                                                        <span class="text-[10px] text-slate-400 font-mono bg-slate-50 px-1 py-0.5 rounded w-max">{getValue(tagGroupForm, `tags.${index()}.slug` as any)}</span>
                                                    </div>
                                                )}
                                            </For>
                                        </Show>
                                        <Show when={fieldArray.items.length > 0 && fieldArray.error}>
                                            <div class="w-full mt-4 p-3 rounded-lg bg-red-50 border border-red-100 text-xs font-medium text-red-600 flex items-center gap-2">
                                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                {fieldArray.error}
                                            </div>
                                        </Show>
                                    </div>
                                )}
                            </FieldArray>
                        </div>
                    </Card>
                </main>
            </Form>
        </div>
    );
}

// ─── Edit Form ────────────────────────────────────────────────────────────────

interface EditTagGroupFormProps {
    group: TagGroup;
    children?: JSX.Element;
    hideHeader?: boolean;
}

export function EditTagGroupForm(props: EditTagGroupFormProps) {
    const navigate = useNavigate();
    const updateTrigger = useAction(updateTagGroup);
    const submission = useSubmission(updateTagGroup);

    const [isSlugManual, setIsSlugManual] = createSignal(true); // Default to true so we don't accidentally overwrite existing slugs

    const [tagGroupForm, { Form, Field }] = createForm<UpdateTagGroupFormData>({
        initialValues: {
            slug: props.group.slug || "",
            isActive: props.group.isActive
        },
        validate: (values) => {
            const result = updateTagGroupSchema.safeParse(values);
            if (result.success) return {};
            const errors: Record<string, string> = {};
            result.error.issues.forEach((issue: any) => {
                if (issue.path.length > 0) {
                    errors[(issue.path as string[]).join(".")] = issue.message;
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
        <div class={props.hideHeader ? "" : "px-6 py-8 mx-auto max-w-[1400px]"}>
            <Show when={!props.hideHeader}>
                <FormHeader
                    title={`Edit: ${props.group.name || "Untitled Group"}`}
                    subtitle="Modify group settings and active status."
                    isSubmitting={isPending()}
                    onCancel={() => navigate(`/tags/groups/${props.group.id}`)}
                    onSubmit={() => {
                        const formElement = document.getElementById("edit-tag-group-form") as HTMLFormElement;
                        formElement?.requestSubmit();
                    }}
                    submitLabel="Save Changes"
                    backHref={`/tags/groups/${props.group.id}`}
                    backLabel="Back to Tag Group"
                />
            </Show>

            <Form id="edit-tag-group-form" onSubmit={handleSubmit} class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <aside class="lg:col-span-1 space-y-6">
                    <Card class="p-6">
                        <h3 class="text-base font-semibold text-slate-900 mb-6">Group Settings</h3>
                        <div class="space-y-5">
                            <div class="space-y-2">
                                <label class="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    Group Name (Read-only) *
                                </label>
                                <div class="px-3 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-500 font-medium">
                                    {props.group.name || "N/A"}
                                </div>
                                <p class="text-[10px] text-slate-400">To edit the name, use the Translations tab.</p>
                            </div>

                            <Field name="slug">
                                {(field, fieldProps) => {
                                    const handleSlugChange = (e: Event) => {
                                        setValue(tagGroupForm, "slug", (e.currentTarget as HTMLInputElement).value);
                                        setIsSlugManual(true);
                                    };

                                    return (
                                        <Input
                                            {...fieldProps}
                                            label="Slug *"
                                            placeholder="e.g. light-requirements"
                                            value={field.value}
                                            error={field.error}
                                            maxLength={255}
                                            disabled={isPending()}
                                            onInput={handleSlugChange}
                                        />
                                    );
                                }}
                            </Field>

                            <Field name="isActive" type="boolean">
                                {(field, fieldProps) => (
                                    <div class="flex items-center justify-between p-4 rounded-lg border border-slate-100 bg-slate-50/50">
                                        <div>
                                            <p class="text-sm font-medium text-slate-900">Active Status</p>
                                            <p class="text-xs text-slate-500 mt-0.5">Visible globally when enabled.</p>
                                        </div>
                                        <label class="relative inline-flex items-center cursor-pointer">
                                            <input
                                                {...fieldProps}
                                                type="checkbox"
                                                class="sr-only peer"
                                                checked={!!field.value}
                                                disabled={isPending()}
                                            />
                                            <div class="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-green-600"></div>
                                        </label>
                                    </div>
                                )}
                            </Field>
                        </div>
                    </Card>

                    <Show when={submission.error}>
                        <div class="p-4 rounded-xl bg-red-50 border border-red-100 text-sm text-red-700">
                            {submission.error.message || "Failed to update tag group."}
                        </div>
                    </Show>
                </aside>

                <main class="lg:col-span-2 space-y-6">
                    {props.children || (
                        <Card class="p-12 flex flex-col items-center justify-center text-center">
                            <div class="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M7 21h10" /><path d="M12 21V3" /><path d="m7 8 5-5 5 5" />
                                </svg>
                            </div>
                            <h3 class="text-lg font-semibold text-slate-900">Advanced Title Management</h3>
                            <p class="text-sm text-slate-500 mt-2 max-w-sm">
                                Manage multi-language translations and tag values inside the group detail view for better precision.
                            </p>
                        </Card>
                    )}
                </main>
            </Form>
        </div>
    );
}

