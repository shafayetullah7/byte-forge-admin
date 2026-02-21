import { JSX, mergeProps } from "solid-js";

interface ButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline";
    size?: "sm" | "md" | "lg";
    isLoading?: boolean;
}

export function Button(props: ButtonProps) {
    const merged = mergeProps({ variant: "primary", size: "md" }, props);

    const baseClasses =
        "inline-flex items-center justify-center rounded-lg font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-primary-green focus:ring-offset-2 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100";

    const variants = {
        primary: "bg-primary-green text-white hover:bg-primary-green-hover shadow-sm",
        secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200",
        outline:
            "border border-slate-200 bg-white hover:bg-slate-50 text-slate-900 shadow-sm",
    };

    const sizes = {
        sm: "h-9 px-3 text-xs",
        md: "h-11 px-6 text-sm",
        lg: "h-13 px-8 text-base",
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
