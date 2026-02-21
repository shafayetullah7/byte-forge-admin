import { JSX, mergeProps } from "solid-js";

interface ButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline";
    size?: "sm" | "md" | "lg";
    isLoading?: boolean;
}

export function Button(props: ButtonProps) {
    const merged = mergeProps({ variant: "primary", size: "md" }, props);

    const baseClasses =
        "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

    const variants = {
        primary: "bg-[var(--color-indigo-600)] text-white hover:bg-indigo-700",
        secondary: "bg-[var(--color-slate-100)] text-[var(--color-slate-900)] hover:bg-slate-200",
        outline:
            "border border-[var(--color-slate-200)] bg-transparent hover:bg-slate-50 text-[var(--color-slate-900)]",
    };

    const sizes = {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4 py-2 text-sm",
        lg: "h-12 px-6 text-base",
    };

    return (
        <button
            {...merged}
            class={`${baseClasses} ${variants[merged.variant as keyof typeof variants]} ${sizes[merged.size as keyof typeof sizes]} ${merged.class || ""}`}
            disabled={merged.disabled || merged.isLoading}
        >
            {merged.isLoading ? (
                <svg
                    class="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path
                        class="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                </svg>
            ) : null}
            {merged.children}
        </button>
    );
}
