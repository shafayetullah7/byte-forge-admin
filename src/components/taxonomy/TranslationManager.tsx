import { For, createSignal, Show } from "solid-js";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

export interface TranslationItem {
    locale: string;
    name: string;
    description: string | null;
}

export interface UpsertTranslationDto {
    locale: string;
    name: string;
    description?: string;
}

interface TranslationManagerProps {
    translations: TranslationItem[];
    onUpsert: (data: UpsertTranslationDto) => Promise<void>;
    onDelete: (locale: string) => Promise<void>;
}

export function TranslationManager(props: TranslationManagerProps) {
    const [locale, setLocale] = createSignal("");
    const [name, setName] = createSignal("");
    const [description, setDescription] = createSignal("");
    const [isSubmitting, setIsSubmitting] = createSignal(false);
    const [editingLocale, setEditingLocale] = createSignal<string | null>(null);

    const resetForm = () => {
        setLocale("");
        setName("");
        setDescription("");
        setEditingLocale(null);
    };

    const handleEdit = (translation: TranslationItem) => {
        setLocale(translation.locale);
        setName(translation.name);
        setDescription(translation.description || "");
        setEditingLocale(translation.locale);
    };

    const handleSubmit = async () => {
        if (!locale().trim() || !name().trim()) return;

        setIsSubmitting(true);
        try {
            await props.onUpsert({
                locale: locale().trim().toLowerCase(),
                name: name().trim(),
                description: description().trim() || undefined
            });
            resetForm();
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (targetLocale: string) => {
        if (targetLocale === 'en') {
            alert("The base English ('en') translation cannot be deleted.");
            return;
        }
        if (confirm(`Are you sure you want to delete the '${targetLocale}' translation?`)) {
            await props.onDelete(targetLocale);
        }
    };

    return (
        <div class="space-y-6">
            {/* List of existing translations */}
            <div class="rounded-lg border border-slate-200 overflow-hidden bg-white">
                <table class="min-w-full divide-y divide-slate-200">
                    <thead class="bg-slate-50">
                        <tr>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Locale</th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Name</th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Description</th>
                            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-slate-200">
                        <For each={props.translations} fallback={
                            <tr>
                                <td colspan="4" class="px-6 py-8 text-center text-sm text-slate-400">
                                    No translations available.
                                </td>
                            </tr>
                        }>
                            {(t) => (
                                <tr class="hover:bg-slate-50 transition-colors">
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 border-l-[3px] border-transparent" classList={{ 'border-l-primary-green-500 bg-primary-green-50/30': t.locale === 'en' }}>
                                        {t.locale.toUpperCase()}
                                        <Show when={t.locale === 'en'}>
                                            <span class="ml-2 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-primary-green-100 text-primary-green-800">BASE</span>
                                        </Show>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                                        {t.name}
                                    </td>
                                    <td class="px-6 py-4 text-sm text-slate-500 truncate max-w-[200px]">
                                        <Show when={t.description} fallback={<span class="text-slate-300 italic">None</span>}>
                                            {t.description}
                                        </Show>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => handleEdit(t)}
                                            class="text-indigo-600 hover:text-indigo-900 mr-4 transition-colors"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(t.locale)}
                                            class="text-red-600 hover:text-red-900 transition-colors"
                                            disabled={t.locale === 'en'}
                                            classList={{ 'opacity-30 cursor-not-allowed': t.locale === 'en' }}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            )}
                        </For>
                    </tbody>
                </table>
            </div>

            {/* Upsert Form */}
            <div class="bg-slate-50 rounded-lg p-5 border border-slate-200">
                <h3 class="text-sm font-semibold text-slate-800 mb-4">
                    {editingLocale() ? `Edit Translation: ${editingLocale()?.toUpperCase()}` : "Add New Translation"}
                </h3>

                <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div class="md:col-span-1">
                        <Input
                            label="Locale Code *"
                            placeholder="e.g. fr, es, de"
                            value={locale()}
                            onInput={(e) => setLocale(e.currentTarget.value)}
                            disabled={editingLocale() !== null} // Cannot change locale code when editing
                        />
                    </div>
                    <div class="md:col-span-3">
                        <Input
                            label="Translated Name *"
                            placeholder="Translation for the name..."
                            value={name()}
                            onInput={(e) => setName(e.currentTarget.value)}
                        />
                    </div>
                    <div class="md:col-span-4">
                        <label class="block text-sm font-medium text-slate-700 mb-1.5">
                            Translated Description
                        </label>
                        <textarea
                            rows={2}
                            class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-green-500 focus:border-primary-green-500 transition-shadow m-0"
                            placeholder="Translation for the description..."
                            value={description()}
                            onInput={(e) => setDescription(e.currentTarget.value)}
                        />
                    </div>
                </div>

                <div class="mt-4 flex justify-end gap-3">
                    <Show when={locale() || name() || description()}>
                        <Button variant="outline" size="sm" onClick={resetForm} disabled={isSubmitting()}>
                            Cancel
                        </Button>
                    </Show>
                    <Button
                        variant="primary"
                        size="sm"
                        onClick={handleSubmit}
                        disabled={!locale().trim() || !name().trim() || isSubmitting()}
                    >
                        {isSubmitting() ? "Saving..." : editingLocale() ? "Update Translation" : "Add Translation"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
