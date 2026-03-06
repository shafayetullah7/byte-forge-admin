import { createSignal, createEffect } from "solid-js";
import { A, useNavigate, useAction } from "@solidjs/router";
import { ArrowLeftIcon } from "~/components/icons";
import { Button } from "~/components/ui/Button";
import { Input } from "~/components/ui/Input";
import { Card } from "~/components/ui/Card";
import { createCategory } from "~/lib/api/endpoints/categories/categories.actions";

export default function CreateCategoryPage() {
    const navigate = useNavigate();
    const createCategoryAction = useAction(createCategory);
    const [name, setName] = createSignal("");
    const [slug, setSlug] = createSignal("");
    const [isSlugManual, setIsSlugManual] = createSignal(false);
    const [description, setDescription] = createSignal("");
    const [isActive, setIsActive] = createSignal(true);

    const generateSlug = (val: string) => {
        return val
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    };

    createEffect(() => {
        const currentName = name();
        if (!isSlugManual() && currentName) {
            setSlug(generateSlug(currentName));
        }
    });

    const handleSubmit = async () => {
        if (!name().trim() || !slug().trim()) return;

        await createCategoryAction({
            slug: slug().trim(),
            isActive: isActive(),
            translations: [
                {
                    locale: "en",
                    name: name().trim(),
                    description: description().trim() || null
                }
            ]
        });

        navigate("/categories");
    };

    return (
        <div class="px-6 py-8 mx-auto max-w-[900px]">
            <div class="mb-6">
                <A href="/categories" class="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-primary-green-700 transition-colors mb-4">
                    <ArrowLeftIcon width="16" height="16" />
                    Back to Categories
                </A>
                <h1 class="text-2xl font-bold text-slate-900">Add Root Category</h1>
                <p class="text-sm text-slate-500 mt-1">
                    Create a new top-level category for the product catalog.
                </p>
            </div>

            <Card class="p-6">
                <div class="space-y-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label="Category Name *"
                            placeholder="e.g. Indoor Plants"
                            value={name()}
                            onInput={(e) => setName(e.currentTarget.value)}
                        />
                        <Input
                            label="Slug Path *"
                            placeholder="e.g. indoor-plants"
                            value={slug()}
                            onInput={(e) => {
                                setSlug(e.currentTarget.value);
                                setIsSlugManual(true);
                            }}
                        />
                    </div>

                    <div class="space-y-2">
                        <label class="block text-sm font-medium text-slate-700">Description</label>
                        <textarea
                            rows={4}
                            class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-green-500 focus:border-primary-green-500 transition-shadow"
                            placeholder="Describe this category's purpose..."
                            value={description()}
                            onInput={(e) => setDescription(e.currentTarget.value)}
                        />
                    </div>

                    <div class="flex items-center justify-between p-4 rounded-lg bg-slate-50 border border-slate-200">
                        <div>
                            <p class="text-sm font-medium text-slate-900">Active Status</p>
                            <p class="text-xs text-slate-500">Visible in the storefront navigation immediately.</p>
                        </div>
                        <label class="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                class="sr-only peer"
                                checked={isActive()}
                                onChange={(e) => setIsActive(e.currentTarget.checked)}
                            />
                            <div class="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-green-600"></div>
                        </label>
                    </div>

                    <div class="flex justify-end gap-3 pt-4 border-t border-slate-100">
                        <Button variant="outline" size="md" onClick={() => navigate("/categories")}>
                            Cancel
                        </Button>
                        <Button variant="primary" size="md" onClick={handleSubmit}>
                            Create Category
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
}
