import { JSX, Show } from "solid-js";

interface InputProps extends JSX.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
    suffix?: JSX.Element;
}

export function Input(props: InputProps) {
    const { label, error, suffix, ...rest } = props;

    return (
        <div class="space-y-2 w-full">
            <label class="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                {label}
            </label>
            <div class="relative">
                <input
                    {...rest}
                    class={`block w-full rounded-lg border bg-white px-3 py-2.5 text-sm ring-offset-white transition-all focus:border-primary-green focus:outline-none focus:ring-2 focus:ring-primary-green/20 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500 ${error ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : "border-slate-200"
                        } ${suffix ? "pr-10" : ""} ${props.class || ""}`}
                />
                <Show when={suffix}>
                    <div class="absolute inset-y-0 right-0 flex items-center pr-3">
                        {suffix}
                    </div>
                </Show>
            </div>
            <Show when={error}>
                <p class="text-xs font-medium text-red-500">{error}</p>
            </Show>
        </div>
    );
}
