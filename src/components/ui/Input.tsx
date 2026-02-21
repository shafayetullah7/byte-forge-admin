import { JSX, Show } from "solid-js";

interface InputProps extends JSX.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
}

export function Input(props: InputProps) {
    const { label, error, ...rest } = props;

    return (
        <div class="space-y-1.5 w-full">
            <label class="block text-sm font-medium text-[var(--color-slate-900)]">
                {label}
            </label>
            <input
                {...rest}
                class={`block w-full rounded-lg border px-3 py-2 text-sm transition-colors focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500 ${error ? "border-red-500" : "border-[var(--color-slate-200)]"
                    } ${props.class || ""}`}
            />
            <Show when={error}>
                <p class="text-[12px] font-medium text-red-500">{error}</p>
            </Show>
        </div>
    );
}
