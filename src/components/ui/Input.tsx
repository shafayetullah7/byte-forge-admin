import { JSX, Show } from "solid-js";

interface InputProps extends JSX.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
}

export function Input(props: InputProps) {
    const { label, error, ...rest } = props;

    return (
        <div class="space-y-2 w-full">
            <label class="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                {label}
            </label>
            <input
                {...rest}
                class={`block w-full rounded-lg border bg-white px-3 py-2.5 text-sm ring-offset-white transition-all focus:border-primary-green focus:outline-none focus:ring-2 focus:ring-primary-green/20 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500 ${error ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : "border-slate-200"
                    } ${props.class || ""}`}
            />
            <Show when={error}>
                <p class="text-xs font-medium text-red-500">{error}</p>
            </Show>
        </div>
    );
}
