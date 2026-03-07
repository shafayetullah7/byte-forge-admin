import { createSignal, createMemo, Show, For, onMount, onCleanup, JSX, splitProps } from "solid-js";
import { Portal } from "solid-js/web";

interface AdvancedSelectProps<T> {
    label?: string;
    options: T[];
    value: string | null;
    onChange: (value: string | null) => void;
    getLabel: (option: T) => string;
    getValue: (option: T) => string;
    renderOption?: (option: T) => JSX.Element;
    placeholder?: string;
    searchPlaceholder?: string;
    emptyMessage?: string;
    error?: string;
    disabled?: boolean;
    class?: string;
    allowClear?: boolean;
}

export function AdvancedSelect<T>(props: AdvancedSelectProps<T>) {
    const [isOpen, setIsOpen] = createSignal(false);
    const [search, setSearch] = createSignal("");
    let containerRef: HTMLDivElement | undefined;
    let inputRef: HTMLInputElement | undefined;

    const selectedOption = createMemo(() =>
        props.options.find(opt => props.getValue(opt) === props.value)
    );

    const filteredOptions = createMemo(() => {
        const query = search().toLowerCase();
        if (!query) return props.options;
        return props.options.filter(opt =>
            props.getLabel(opt).toLowerCase().includes(query)
        );
    });

    const handleClickOutside = (e: MouseEvent) => {
        if (containerRef && !containerRef.contains(e.target as Node)) {
            setIsOpen(false);
        }
    };

    onMount(() => {
        document.addEventListener("mousedown", handleClickOutside);
    });

    onCleanup(() => {
        document.removeEventListener("mousedown", handleClickOutside);
    });

    const handleToggle = () => {
        if (props.disabled) return;
        setIsOpen(!isOpen());
        if (isOpen()) {
            setSearch("");
            setTimeout(() => inputRef?.focus(), 0);
        }
    };

    const handleSelect = (option: T) => {
        props.onChange(props.getValue(option));
        setIsOpen(false);
    };

    const handleClear = (e: MouseEvent) => {
        e.stopPropagation();
        props.onChange(null);
    };

    return (
        <div class={`relative space-y-1.5 w-full ${props.class || ""}`} ref={containerRef}>
            <Show when={props.label}>
                <label class="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                    {props.label}
                </label>
            </Show>

            <div
                onClick={handleToggle}
                class={`flex items-center justify-between w-full h-11 px-3.5 py-2 text-sm bg-white border rounded-xl cursor-base transition-all ring-offset-white ring-primary-green-500/20
                    ${isOpen() ? "border-primary-green-500 ring-2" : "border-slate-200 hover:border-slate-300"}
                    ${props.disabled ? "bg-slate-50 cursor-not-allowed opacity-60" : "cursor-pointer"}
                    ${props.error ? "border-red-500 ring-red-500/20" : ""}
                `}
            >
                <div class="flex-1 truncate">
                    <Show
                        when={selectedOption()}
                        fallback={<span class="text-slate-400">{props.placeholder || "Select an option..."}</span>}
                    >
                        {(opt) => (
                            <div class="flex items-center gap-2">
                                {props.renderOption ? props.renderOption(opt()) : props.getLabel(opt())}
                            </div>
                        )}
                    </Show>
                </div>

                <div class="flex items-center gap-2 ml-2">
                    <Show when={props.allowClear && props.value}>
                        <button
                            onClick={handleClear}
                            class="p-1 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M18 6 6 18M6 6l12 12" />
                            </svg>
                        </button>
                    </Show>
                    <svg
                        class={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpen() ? "rotate-180" : ""}`}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    >
                        <path d="m6 9 6 6 6-6" />
                    </svg>
                </div>
            </div>

            <Show when={props.error}>
                <p class="text-[10px] font-medium text-red-500">{props.error}</p>
            </Show>

            <Show when={isOpen()}>
                <Portal>
                    <div
                        class="fixed z-[9999] bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
                        style={{
                            width: `${containerRef?.offsetWidth}px`,
                            top: `${(containerRef?.getBoundingClientRect().bottom || 0) + 6}px`,
                            left: `${containerRef?.getBoundingClientRect().left}px`,
                            "max-height": "320px"
                        }}
                    >
                        {/* Search Area */}
                        <div class="p-2 border-b border-slate-50 sticky top-0 bg-white/80 backdrop-blur-md z-10">
                            <div class="relative">
                                <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
                                    </svg>
                                </span>
                                <input
                                    ref={inputRef}
                                    type="text"
                                    class="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border-none rounded-lg focus:ring-1 focus:ring-primary-green-500 outline-none placeholder:text-slate-400"
                                    placeholder={props.searchPlaceholder || "Search..."}
                                    value={search()}
                                    onInput={(e) => setSearch(e.currentTarget.value)}
                                    autofocus
                                />
                            </div>
                        </div>

                        {/* Options List */}
                        <div class="overflow-y-auto max-h-[250px] p-1.5 scrollbar-thin scrollbar-thumb-slate-200">
                            <For each={filteredOptions()} fallback={
                                <div class="px-4 py-8 text-center text-xs text-slate-400 italic">
                                    {props.emptyMessage || "No options found"}
                                </div>
                            }>
                                {(option) => (
                                    <div
                                        onClick={() => handleSelect(option)}
                                        class={`flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer text-sm transition-all
                                            ${props.getValue(option) === props.value
                                                ? "bg-primary-green-50 text-primary-green-800 font-semibold"
                                                : "text-slate-700 hover:bg-slate-50 hover:pl-4"}
                                        `}
                                    >
                                        <div class="flex-1 truncate">
                                            {props.renderOption ? props.renderOption(option) : props.getLabel(option)}
                                        </div>
                                        <Show when={props.getValue(option) === props.value}>
                                            <svg class="w-4 h-4 text-primary-green-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                                                <polyline points="20 6 9 17 4 12" />
                                            </svg>
                                        </Show>
                                    </div>
                                )}
                            </For>
                        </div>
                    </div>
                </Portal>
            </Show>
        </div>
    );
}
