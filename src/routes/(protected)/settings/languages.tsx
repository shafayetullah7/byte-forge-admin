import { createAsync, type RouteDefinition } from "@solidjs/router";
import { For, Suspense } from "solid-js";
import { getLanguages } from "~/lib/api/endpoints/languages";
import { Card } from "~/components/ui/Card";
import { Badge } from "~/components/ui/Badge";

export const route: RouteDefinition = {
    preload: () => getLanguages(),
};

export default function LanguagesPage() {
    const languages = createAsync(() => getLanguages());

    return (
        <div class="px-6 py-8 mx-auto max-w-[1000px]">
            {/* Header Area */}
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 class="text-2xl font-bold text-slate-900 leading-tight">System Languages</h1>
                    <p class="text-sm text-slate-500 mt-1 max-w-2xl">
                        Manage and review the locales available for multi-language content across your product catalog and taxonomy.
                    </p>
                </div>
            </div>

            {/* Table Card */}
            <Card class="overflow-hidden border-slate-200 shadow-sm transition-all duration-300 hover:shadow-md">
                <div class="overflow-x-auto ring-1 ring-slate-200 rounded-xl">
                    <table class="w-full text-left border-collapse">
                        <thead>
                            <tr class="bg-slate-50/80 border-b border-slate-200">
                                <th class="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Display Name</th>
                                <th class="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">ISO Code</th>
                                <th class="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Direction</th>
                                <th class="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100 bg-white">
                            <Suspense fallback={
                                <For each={[1, 2, 3]}>
                                    {() => (
                                        <tr class="animate-pulse">
                                            <td colspan="4" class="px-6 py-5">
                                                <div class="h-5 bg-slate-100 rounded w-full"></div>
                                            </td>
                                        </tr>
                                    )}
                                </For>
                            }>
                                <For each={languages()} fallback={
                                    <tr>
                                        <td colspan="4" class="px-6 py-12 text-center">
                                            <div class="flex flex-col items-center">
                                                <div class="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-slate-400 font-bold"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
                                                </div>
                                                <h3 class="text-sm font-bold text-slate-400">No languages found</h3>
                                                <p class="text-xs text-slate-400 mt-1">Check your backend configuration.</p>
                                            </div>
                                        </td>
                                    </tr>
                                }>
                                    {(lang) => (
                                        <tr class="group hover:bg-slate-50/50 transition-all duration-200">
                                            <td class="px-6 py-4">
                                                <div class="flex items-center gap-3">
                                                    <div class="w-8 h-8 rounded-lg bg-primary-green-50 flex items-center justify-center text-primary-green-600 font-bold text-xs border border-primary-green-100 group-hover:bg-primary-green-100 transition-colors">
                                                        {lang.code.toUpperCase()}
                                                    </div>
                                                    <span class="font-semibold text-slate-900">{lang.name}</span>
                                                </div>
                                            </td>
                                            <td class="px-6 py-4">
                                                <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
                                                    {lang.code}
                                                </span>
                                            </td>
                                            <td class="px-6 py-4 text-xs font-medium text-slate-500 italic">
                                                {lang.isRtl ? "Right-to-Left (RTL)" : "Left-to-Right (LTR)"}
                                            </td>
                                            <td class="px-6 py-4 text-right">
                                                <Badge variant={lang.isActive ? "success" : "secondary"} size="sm">
                                                    {lang.isActive ? "ACTIVE" : "INACTIVE"}
                                                </Badge>
                                            </td>
                                        </tr>
                                    )}
                                </For>
                            </Suspense>
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Hint Box */}
            <div class="mt-8 p-5 bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 rounded-2xl flex gap-4 shadow-sm">
                <div class="p-2 bg-indigo-500 rounded-xl text-white shadow-md shadow-indigo-200 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" /><line x1="4" y1="22" x2="4" y2="15" /></svg>
                </div>
                <div>
                    <h4 class="text-sm font-bold text-indigo-950">Architecture Note</h4>
                    <p class="text-xs text-indigo-800/80 mt-1 leading-relaxed">
                        The available languages are strictly defined by the backend configuration. These localized entries enable the translation interface in the Tag and Category management modules.
                    </p>
                </div>
            </div>
        </div>
    );
}
