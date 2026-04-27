import { JSX, createSignal, splitProps, Show } from "solid-js";
import { EyeIcon } from "~/components/icons/EyeIcon";
import { EyeSlashIcon } from "~/components/icons/EyeSlashIcon";

interface PasswordInputProps extends Omit<JSX.InputHTMLAttributes<HTMLInputElement>, "type"> {
    label: string;
    error?: string;
    value: string;
    placeholder?: string;
}

export function PasswordInput(props: PasswordInputProps) {
    const [local, rest] = splitProps(props, ["label", "error", "class", "value", "id"]);
    const [showPassword, setShowPassword] = createSignal(false);

    const id = local.id || `password-input`;
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
                    type={showPassword() ? "text" : "password"}
                    id={id}
                    value={local.value ?? ""}
                    aria-invalid={!!local.error}
                    aria-describedby={local.error ? errorId : undefined}
                    class={`block w-full rounded-lg border bg-white px-3 py-2.5 pr-10 text-sm ring-offset-white transition-all focus:border-primary-green-500 focus:outline-none focus:ring-2 focus:ring-primary-green-500/20 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500 ${local.error ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : "border-slate-200"
                        } ${local.class || ""}`}
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword())}
                    class="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 transition-colors disabled:cursor-not-allowed"
                    aria-label={showPassword() ? "Hide password" : "Show password"}
                    disabled={rest.disabled}
                >
                    <Show when={showPassword()} fallback={<EyeIcon />}>
                        <EyeSlashIcon />
                    </Show>
                </button>
            </div>
            <Show when={local.error}>
                <p id={errorId} class="text-xs font-medium text-red-500">{local.error}</p>
            </Show>
        </div>
    );
}
