import { For, JSX, Show, splitProps } from "solid-js";

interface SelectOption {
    value: string;
    label: string;
}

interface SelectProps extends JSX.SelectHTMLAttributes<HTMLSelectElement> {
    label: string;
    options: SelectOption[];
    error?: string;
}

export function Select(props: SelectProps) {
    const [local, rest] = splitProps(props, ["label", "options", "error", "class", "value", "id"]);
    const id = local.id || `select-${Math.random().toString(36).slice(2, 11)}`;
    const errorId = `${id}-error`;

    return (
        <div class="space-y-2 w-full">
            <label
                for={id}
                class="block text-xs font-semibold uppercase tracking-wider text-slate-500"
            >
                {local.label}
            </label>
            <select
                {...rest}
                id={id}
                value={local.value ?? ""}
                class={`block w-full rounded-lg border bg-white px-3 py-2.5 text-sm ring-offset-white transition-all focus:border-primary-green-500 focus:outline-none focus:ring-2 focus:ring-primary-green-500/20 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500 ${local.error ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : "border-slate-200"
                    } ${local.class || ""}`}
            >
                <option value="" disabled selected>Select an option</option>
                <For each={local.options}>
                    {(option) => <option value={option.value}>{option.label}</option>}
                </For>
            </select>
            <Show when={local.error}>
                <p id={errorId} class="text-xs font-medium text-red-500">{local.error}</p>
            </Show>
        </div>
    );
}
