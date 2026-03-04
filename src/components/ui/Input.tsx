import { JSX, Show, splitProps } from "solid-js";

interface InputProps extends JSX.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
    suffix?: JSX.Element;
}

export function Input(props: InputProps) {
    const [local, rest] = splitProps(props, ["label", "error", "suffix", "class", "value", "id"]);
    const id = local.id || `input-${Math.random().toString(36).slice(2, 11)}`;
    const errorId = `${id}-error`;

    return (
        <div class="space-y-2 w-full">
            <label
                for={id}
                class="block text-xs font-semibold uppercase tracking-wider text-slate-500"
            >
                {local.label}
            </label>
            <div class="relative">
                <input
                    {...rest}
                    id={id}
                    value={local.value ?? ""}
                    aria-invalid={!!local.error}
                    aria-describedby={local.error ? errorId : undefined}
                    class={`block w-full rounded-lg border bg-white px-3 py-2.5 text-sm ring-offset-white transition-all focus:border-primary-green-500 focus:outline-none focus:ring-2 focus:ring-primary-green-500/20 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500 ${local.error ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : "border-slate-200"
                        } ${local.suffix ? "pr-10" : ""} ${local.class || ""}`}
                />
                <Show when={local.suffix}>
                    <div class="absolute inset-y-0 right-0 flex items-center pr-3">
                        {local.suffix}
                    </div>
                </Show>
            </div>
            <Show when={local.error}>
                <p id={errorId} class="text-xs font-medium text-red-500">{local.error}</p>
            </Show>
        </div>
    );
}
