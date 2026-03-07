import { createSignal, createEffect } from "solid-js";
import { A, useNavigate, useAction, createAsync } from "@solidjs/router";
import { ArrowLeftIcon } from "~/components/icons";
import { Button } from "~/components/ui/Button";
import { Input } from "~/components/ui/Input";
import { Card } from "~/components/ui/Card";
import { createCategory } from "~/lib/api/endpoints/categories/categories.actions";
import { getCategoryTree } from "~/lib/api/endpoints/categories/categories.api";
import { CategorySelector } from "~/components/categories/CategorySelector";
import { slugify } from "~/lib/utils/slugify";
import { SafeErrorBoundary, PageErrorFallback } from "~/components/errors";

export default function CreateCategoryPage() {
    const navigate = useNavigate();
    const createCategoryAction = useAction(createCategory);
    const categoriesTree = createAsync(() => getCategoryTree());

    // English (Primary)
    const [name, setName] = createSignal("");
    const [slug, setSlug] = createSignal("");
    const [isSlugManual, setIsSlugManual] = createSignal(false);
    const [description, setDescription] = createSignal("");

    // Bengali
    const [nameBn, setNameBn] = createSignal("");
    const [descriptionBn, setDescriptionBn] = createSignal("");

    // Configuration
    const [isActive, setIsActive] = createSignal(true);
    const [parentId, setParentId] = createSignal<string | null>(null);

    createEffect(() => {
        const currentName = name();
        if (!isSlugManual()) {
            setSlug(slugify(currentName));
        }
    });

    const handleSubmit = async () => {
        if (!name().trim() || !slug().trim()) return;

        const translations = [
            {
                locale: "en",
                name: name().trim(),
                description: description().trim() || null
            }
        ];

        if (nameBn().trim()) {
            translations.push({
                locale: "bn",
                name: nameBn().trim(),
                description: descriptionBn().trim() || null
            });
        }

        await createCategoryAction({
            slug: slug().trim(),
            isActive: isActive(),
            parentId: parentId() || undefined,
            translations
        });

        navigate("/categories");
    };

    return (
        <SafeErrorBoundary fallback={(err, reset) => <PageErrorFallback error={err} reset={reset} />}>
            <div class="px-6 py-8 mx-auto max-w-[1000px]">
                <div class="mb-6">
                    <A href="/categories" class="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-primary-green-700 transition-colors mb-4">
                        <ArrowLeftIcon width="16" height="16" />
                        Back to Categories
                    </A>
                    <h1 class="text-2xl font-bold text-slate-900">Add New Category</h1>
                    <p class="text-sm text-slate-500 mt-1">
                        Define a catalog category, its hierarchy, and multilingual identity.
                    </p>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Form Area */}
                    <div class="lg:col-span-2 space-y-6">
                        <Card class="p-6">
                            <h2 class="text-base font-bold text-slate-900 mb-6">General Identity (English)</h2>
                            <div class="space-y-6">
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Input
                                        label="Category Name (EN) *"
                                        placeholder="e.g. Indoor Plants"
                                        maxLength={255}
                                        minLength={1}
                                        value={name()}
                                        onInput={(e) => setName(e.currentTarget.value)}
                                    />
                                    <Input
                                        label="Slug Path *"
                                        placeholder="e.g. indoor-plants"
                                        maxLength={255}
                                        minLength={1}
                                        value={slug()}
                                        onInput={(e) => {
                                            setSlug(e.currentTarget.value);
                                            setIsSlugManual(true);
                                        }}
                                    />
                                </div>

                                <div class="space-y-2">
                                    <label class="block text-sm font-medium text-slate-700">Description (EN)</label>
                                    <textarea
                                        rows={3}
                                        maxLength={1000}
                                        class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-primary-green-500 focus:outline-none focus:ring-2 focus:ring-primary-green-500/20 transition-all min-h-[100px]"
                                        placeholder="Describe this category's purpose..."
                                        value={description()}
                                        onInput={(e) => setDescription(e.currentTarget.value)}
                                    />
                                </div>
                            </div>
                        </Card>

                        <Card class="p-6">
                            <h2 class="text-base font-bold text-slate-900 mb-6">Identity (Bengali)</h2>
                            <div class="space-y-6">
                                <Input
                                    label="Category Name (BN)"
                                    placeholder="ইনডোর প্ল্যান্টস"
                                    maxLength={255}
                                    value={nameBn()}
                                    onInput={(e) => setNameBn(e.currentTarget.value)}
                                />
                                <div class="space-y-2">
                                    <label class="block text-sm font-medium text-slate-700">Description (BN)</label>
                                    <textarea
                                        rows={3}
                                        maxLength={1000}
                                        class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-primary-green-500 focus:outline-none focus:ring-2 focus:ring-primary-green-500/20 transition-all min-h-[100px]"
                                        placeholder="এই ক্যাটাগরির বর্ণনা..."
                                        value={descriptionBn()}
                                        onInput={(e) => setDescriptionBn(e.currentTarget.value)}
                                    />
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Sidebar Configuration */}
                    <div class="lg:col-span-1 space-y-6">
                        <Card class="p-6">
                            <h2 class="text-base font-bold text-slate-900 mb-6">Hierarchy & Status</h2>
                            <div class="space-y-6">
                                <CategorySelector
                                    label="Parent Category"
                                    categories={categoriesTree() || []}
                                    value={parentId()}
                                    onChange={setParentId}
                                />

                                <div class="pt-4 border-t border-slate-100 flex items-center justify-between">
                                    <div>
                                        <p class="text-sm font-semibold text-slate-900">Active Status</p>
                                        <p class="text-[10px] text-slate-500">Visible in navigation.</p>
                                    </div>
                                    <label class="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            class="sr-only peer"
                                            checked={isActive()}
                                            onChange={(e) => setIsActive(e.currentTarget.checked)}
                                        />
                                        <div class="w-10 h-5 bg-slate-200 rounded-full peer peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary-green-600"></div>
                                    </label>
                                </div>
                            </div>
                        </Card>

                        <div class="flex flex-col gap-3">
                            <Button variant="primary" size="lg" class="w-full" onClick={handleSubmit}>
                                Create Category
                            </Button>
                            <Button variant="outline" size="lg" class="w-full" onClick={() => navigate("/categories")}>
                                Cancel
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </SafeErrorBoundary>
    );
}
