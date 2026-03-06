import { For, Show, createEffect, createSignal } from "solid-js";
import { useNavigate, useSubmission, useAction, A, type RouteDefinition } from "@solidjs/router";
import { createForm, setValue } from "@modular-forms/solid";
import { Button } from "~/components/ui/Button";
import { Input } from "~/components/ui/Input";
import { Card } from "~/components/ui/Card";
import { ArrowLeftIcon } from "~/components/icons";
import { createTagGroup } from "~/lib/api/endpoints/tag-groups/tag-groups.actions";
import type { CreateTagGroupDto } from "~/lib/api/endpoints/tag-groups/tag-groups.types";
import { slugify } from "~/lib/utils/slugify";
import { createTagGroupSchema, type CreateTagGroupFormData } from "~/schemas/tag-group.schema";

export const route: RouteDefinition = {};

// ─── Reusable Form Header ────────────────────────────────────────────────────

interface FormHeaderProps {
    title: string;
    subtitle?: string;
    backHref?: string;
    backLabel?: string;
}

function FormHeader(props: FormHeaderProps) {
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
            <div>
                <h1 class="text-2xl font-bold text-slate-900">{props.title}</h1>
                <Show when={props.subtitle}>
                    <p class="text-sm text-slate-500 mt-1">{props.subtitle}</p>
                </Show>
            </div>
        </div>
    );
}

interface CreateTagGroupFormProps {
    hideHeader?: boolean;
}

type TagItemDto = NonNullable<CreateTagGroupDto["tags"]>[number];

export default function CreateTagGroupPage(props: CreateTagGroupFormProps) {

    const navigate = useNavigate();
    const createTrigger = useAction(createTagGroup);
    const submission = useSubmission(createTagGroup);

    // Group state
    const [isGroupSlugManual, setIsGroupSlugManual] = createSignal(false);

    // Tags list state
    const [tags, setTags] = createSignal<TagItemDto[]>([]);

    // Draft tag state
    const [tagInputEn, setTagInputEn] = createSignal("");
    const [tagInputBn, setTagInputBn] = createSignal("");
    const [tagSlugInput, setTagSlugInput] = createSignal("");
    const [isTagSlugManual, setIsTagSlugManual] = createSignal(false);

    const [tagGroupForm, { Form, Field }] = createForm<CreateTagGroupFormData>({
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
            result.error.issues.forEach((issue) => {
                if (issue.path.length > 0) {
                    errors[issue.path.join(".")] = issue.message;
                }
            });
            return errors;
        }
    });

    // Handle English tag input
    const handleTagInput = (e: Event) => {
        const val = (e.currentTarget as HTMLInputElement).value;
        setTagInputEn(val);
        if (!isTagSlugManual() && val) {
            setTagSlugInput(slugify(val));
        } else if (!isTagSlugManual() && !val) {
            setTagSlugInput("");
        }
    };

    // Handle tag slug input
    const handleTagSlugInput = (e: Event) => {
        setTagSlugInput((e.currentTarget as HTMLInputElement).value);
        setIsTagSlugManual(true);
    };

    // Handle Bengali tag input
    const handleTagInputBn = (e: Event) => {
        setTagInputBn((e.currentTarget as HTMLInputElement).value);
    };

    // Add a new tag to the list
    const handleAddTag = () => {
        const nameEn = tagInputEn().trim();
        const nameBn = tagInputBn().trim();
        const slugVal = tagSlugInput().trim();

        if (nameEn && nameBn && slugVal && !tags().some(t => t.slug === slugVal)) {
            setTags(prev => [...prev, {
                slug: slugVal,
                isActive: true,
                translations: [
                    { locale: "en", name: nameEn },
                    { locale: "bn", name: nameBn }
                ]
            }]);

            // Reset draft state
            setTagInputEn("");
            setTagInputBn("");
            setTagSlugInput("");
            setIsTagSlugManual(false);
        }
    };

    // Remove a tag from the list
    const handleRemoveTag = (tagSlug: string) => {
        setTags(prev => prev.filter(t => t.slug !== tagSlug));
    };

    // Submit handler - transforms data and calls action
    const handleSubmit = (values: CreateTagGroupFormData) => {
        const apiData: CreateTagGroupDto = {
            slug: values.slug?.trim() || "",
            isActive: values.isActive ?? true,
            translations: (values.translations || []).map(t => ({
                locale: t.locale,
                name: t.name?.trim() || "",
                description: t.description?.trim() || undefined
            })),
            tags: tags()
        };
        createTrigger(apiData);
    };

    // Redirect on success
    createEffect(() => {
        if (submission.result) {
            navigate("/tags");
        }
    });

    const isPending = () => !!submission.pending;

    return (
        <div class="mx-auto w-full">
            <div class={props.hideHeader ? "" : "px-6 py-8 mx-auto max-w-350"}>
                <Form onSubmit={handleSubmit} class="space-y-6">
                    <Show when={!props.hideHeader}>
                        <FormHeader
                            title="Create Tag Group"
                            subtitle="Define a new classification group for entity tagging."
                            backHref="/tags"
                            backLabel="Back to Library"
                        />
                    </Show>

                    {/* Group Information Card */}
                    <Card class="p-6">
                        <h3 class="text-base font-semibold text-slate-900 mb-6">Group Information</h3>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {/* English Name */}
                            <Field name="translations.0.name">
                                {(field, fieldProps) => {
                                    const handleNameChange = (e: Event) => {
                                        const newName = (e.currentTarget as HTMLInputElement).value;
                                        setValue(tagGroupForm, "translations.0.name", newName);

                                        if (!isGroupSlugManual() && newName) {
                                            setValue(tagGroupForm, "slug", slugify(newName));
                                        } else if (!isGroupSlugManual() && !newName) {
                                            setValue(tagGroupForm, "slug", "");
                                        }
                                    };

                                    return (
                                        <Input
                                            {...fieldProps}
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

                            {/* Bengali Name */}
                            <Field name="translations.1.name">
                                {(field, fieldProps) => (
                                    <Input
                                        {...fieldProps}
                                        label="Group Name (Bengali) *"
                                        placeholder="e.g. আলোর প্রয়োজনীয়তা"
                                        value={field.value}
                                        error={field.error}
                                        maxLength={255}
                                        disabled={isPending()}
                                    />
                                )}
                            </Field>
                        </div>

                        {/* Slug */}
                        <div class="mt-5">
                            <Field name="slug">
                                {(field, fieldProps) => {
                                    const handleSlugChange = (e: Event) => {
                                        setValue(tagGroupForm, "slug", (e.currentTarget as HTMLInputElement).value);
                                        setIsGroupSlugManual(true);
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
                        </div>

                        {/* Descriptions */}
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
                            <Field name="translations.0.description">
                                {(field, fieldProps) => (
                                    <div class="space-y-2">
                                        <label class="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                                            Description (English)
                                        </label>
                                        <textarea
                                            {...fieldProps}
                                            rows={3}
                                            class="block w-full rounded-lg border bg-white px-3 py-2.5 text-sm ring-offset-white transition-all focus:border-primary-green-500 focus:outline-none focus:ring-2 focus:ring-primary-green-500/20 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500 border-slate-200"
                                            placeholder="English description..."
                                            value={field.value || ""}
                                            maxLength={1000}
                                            disabled={isPending()}
                                        />
                                    </div>
                                )}
                            </Field>

                            <Field name="translations.1.description">
                                {(field, fieldProps) => (
                                    <div class="space-y-2">
                                        <label class="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                                            Description (Bengali)
                                        </label>
                                        <textarea
                                            {...fieldProps}
                                            rows={3}
                                            class="block w-full rounded-lg border bg-white px-3 py-2.5 text-sm ring-offset-white transition-all focus:border-primary-green-500 focus:outline-none focus:ring-2 focus:ring-primary-green-500/20 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500 border-slate-200"
                                            placeholder="Bengali description..."
                                            value={field.value || ""}
                                            maxLength={1000}
                                            disabled={isPending()}
                                        />
                                    </div>
                                )}
                            </Field>
                        </div>

                        {/* Active Status */}
                        <div class="mt-6">
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

                    {/* Tags Management Card */}
                    <Card class="p-6">
                        <div class="flex items-start justify-between mb-6">
                            <div>
                                <h3 class="text-base font-semibold text-slate-900">Manage Tags</h3>
                                <p class="text-sm text-slate-500 mt-1">
                                    Add specific tag values that belong to this group.
                                </p>
                            </div>
                            <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-primary-green-50 text-primary-green-700 border border-primary-green-100">
                                {tags().length} Tags
                            </span>
                        </div>

                        {/* Tag Input Fields */}
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                            <Input
                                label="Tag Name (English) *"
                                placeholder="e.g. High"
                                value={tagInputEn()}
                                onInput={handleTagInput}
                                maxLength={255}
                                disabled={isPending()}
                            />
                            <Input
                                label="Tag Name (Bengali) *"
                                placeholder="e.g. উচ্চ"
                                value={tagInputBn()}
                                onInput={handleTagInputBn}
                                maxLength={255}
                                disabled={isPending()}
                            />
                        </div>
                        <div class="flex flex-col sm:flex-row gap-3 items-end mb-6">
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
                                type="button"
                                variant="secondary"
                                onClick={handleAddTag}
                                disabled={!tagInputEn().trim() || !tagInputBn().trim() || !tagSlugInput().trim() || isPending()}
                                class="h-11 w-full sm:w-auto"
                            >
                                Add Tag
                            </Button>
                        </div>

                        {/* Tags Display */}
                        <div class={`p-6 rounded-xl border border-dashed bg-slate-50/50 min-h-[200px] flex flex-wrap gap-2.5 content-start border-slate-200`}>
                            <Show
                                when={tags().length > 0}
                                fallback={
                                    <div class="w-full flex flex-col items-center justify-center text-slate-400 py-8">
                                        <p class="text-sm font-medium">No tags added yet</p>
                                    </div>
                                }
                            >
                                <For each={tags()}>
                                    {(tag) => {
                                        const tagNameEn = () => tag.translations.find(t => t.locale === "en")?.name || "";
                                        const tagNameBn = () => tag.translations.find(t => t.locale === "bn")?.name || "";

                                        return (
                                            <div class="inline-flex flex-col gap-1 pl-3 pr-2 py-2 rounded-lg bg-white border border-slate-200 shadow-sm transition-all hover:border-primary-green-300">
                                                <div class="flex items-center justify-between gap-3">
                                                    <div class="flex flex-col">
                                                        <span class="text-sm font-semibold text-slate-700">{tagNameEn()}</span>
                                                        <span class="text-xs text-slate-500 font-medium">{tagNameBn()}</span>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveTag(tag.slug)}
                                                        class="w-5 h-5 rounded flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                                                        disabled={isPending()}
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                                <span class="text-[10px] text-slate-400 font-mono bg-slate-50 px-1 py-0.5 rounded w-max">{tag.slug}</span>
                                            </div>
                                        );
                                    }}
                                </For>
                            </Show>
                        </div>
                    </Card>

                    {/* Error Display */}
                    <Show when={submission.error}>
                        <div class="p-4 rounded-xl bg-red-50 border border-red-100 text-sm text-red-700 flex gap-3">
                            <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {submission.error.message || "Failed to create tag group."}
                        </div>
                    </Show>

                    {/* Action Buttons */}
                    <div class="flex justify-end gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            size="md"
                            onClick={() => navigate("/tags")}
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
                            Create Group
                        </Button>
                    </div>
                </Form>
            </div>
        </div>
    );
}
