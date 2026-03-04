import { For, Show, createMemo } from "solid-js";
import { createStore } from "solid-js/store";
import { createAsync } from "@solidjs/router";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { getLanguages } from "~/lib/api/endpoints/languages";

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
    const [form, setForm] = createStore({
        locale: "",
        name: "",
        description: "",
        editingLocale: null as string | null,
        isSubmitting: false,
        error: "",
    });

    const languages = createAsync(() => getLanguages());

    const availableLanguages = createMemo(() => {
        const all = languages() || [];
        const existingLocales = props.translations.map(t => t.locale);

        return all
            .filter(l => !existingLocales.includes(l.code) || l.code === form.editingLocale)
            .map(l => ({
                value: l.code,
                label: `${l.name} (${l.code.toUpperCase()})${l.isRtl ? ' [RTL]' : ''}`
            }));
    });

    const baseTranslation = createMemo(() =>
        props.translations.find(t => t.locale === 'en')
    );

    const resetForm = () => {
        setForm({
            locale: "",
            name: "",
            description: "",
            editingLocale: null,
            error: "",
        });
    };

    const handleEdit = (translation: TranslationItem) => {
        setForm({
            locale: translation.locale,
            name: translation.name,
            description: translation.description || "",
            editingLocale: translation.locale,
            error: "",
        });
    };

    const handleSubmit = async () => {
        if (!form.locale.trim() || !form.name.trim()) return;

        setForm("isSubmitting", true);
        setForm("error", "");
        try {
            await props.onUpsert({
                locale: form.locale.trim().toLowerCase(),
                name: form.name.trim(),
                description: form.description.trim() || undefined
            });
            resetForm();
        } finally {
            setForm("isSubmitting", false);
        }
    };

    const handleDelete = async (targetLocale: string) => {
        if (targetLocale === 'en') {
            setForm("error", "The base English ('en') translation cannot be deleted.");
            return;
        }

        setForm("error", "");
        if (confirm(`Are you sure you want to delete the '${targetLocale}' translation?`)) {
            await props.onDelete(targetLocale);
        }
    };

    return (
        <div class="space-y-6">
            <Show when={form.error}>
                <div class="p-3 rounded-lg bg-red-100/50 border border-red-200 text-sm text-red-700 flex justify-between items-center">
                    <span>{form.error}</span>
                    <button onClick={() => setForm("error", "")} class="text-red-400 hover:text-red-700 font-bold p-1">✕</button>
                </div>
            </Show>

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
                    {form.editingLocale ? `Edit Translation: ${form.editingLocale.toUpperCase()}` : "Add New Translation"}
                </h3>

                <Show when={form.locale && form.locale !== 'en' && baseTranslation()}>
                    <div class="mb-4 p-3 bg-primary-green-50 border border-primary-green-200 rounded-lg flex items-start gap-3">
                        <div class="mt-0.5 text-primary-green-600">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m5 8 6 6 6-6" /></svg>
                        </div>
                        <div>
                            <p class="text-[10px] font-bold uppercase tracking-wider text-primary-green-700 leading-tight">Translating from English (Base)</p>
                            <p class="text-sm font-medium text-slate-900 mt-0.5 italic">"{baseTranslation()?.name}"</p>
                            <Show when={baseTranslation()?.description}>
                                <p class="text-xs text-slate-500 mt-1 line-clamp-2">{baseTranslation()?.description}</p>
                            </Show>
                        </div>
                    </div>
                </Show>

                <div class="grid grid-cols-1 md:grid-cols-4 gap-4 transition-all">
                    <div class="md:col-span-1">
                        <Select
                            label="Target Language *"
                            options={availableLanguages()}
                            value={form.locale}
                            onChange={(e) => setForm("locale", e.currentTarget.value)}
                            disabled={form.editingLocale !== null}
                        />
                    </div>
                    <div class="md:col-span-3">
                        <Input
                            label="Translated Name *"
                            placeholder="Translation for the name..."
                            value={form.name}
                            onInput={(e) => setForm("name", e.currentTarget.value)}
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
                            value={form.description}
                            onInput={(e) => setForm("description", e.currentTarget.value)}
                        />
                    </div>
                </div>

                <div class="mt-4 flex justify-end gap-3">
                    <Show when={form.locale || form.name || form.description}>
                        <Button variant="outline" size="sm" onClick={resetForm} disabled={form.isSubmitting}>
                            Cancel
                        </Button>
                    </Show>
                    <Button
                        variant="primary"
                        size="sm"
                        onClick={handleSubmit}
                        disabled={!form.locale.trim() || !form.name.trim() || form.isSubmitting}
                        isLoading={form.isSubmitting}
                    >
                        {form.isSubmitting ? "Saving..." : form.editingLocale ? "Update Translation" : "Add Translation"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
