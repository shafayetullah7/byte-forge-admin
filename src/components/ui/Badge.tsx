import { JSX, splitProps } from "solid-js";

interface BadgeProps extends JSX.HTMLAttributes<HTMLSpanElement> {
    variant?: "primary" | "secondary" | "success" | "warning" | "danger" | "info" | "outline";
    size?: "sm" | "md";
}

export function Badge(props: BadgeProps) {
    const [local, others] = splitProps(props, ["variant", "size", "class", "children"]);

    const variants = {
        primary: "bg-primary-green-100 text-primary-green-700 border-primary-green-200",
        secondary: "bg-slate-100 text-slate-600 border-slate-200",
        success: "bg-emerald-100 text-emerald-700 border-emerald-200",
        warning: "bg-amber-100 text-amber-700 border-amber-200",
        danger: "bg-rose-100 text-rose-700 border-rose-200",
        info: "bg-blue-100 text-blue-700 border-blue-200",
        outline: "bg-transparent text-slate-600 border-slate-200"
    };

    const sizes = {
        sm: "px-2 py-0.5 text-[10px]",
        md: "px-2.5 py-1 text-xs"
    };

    return (
        <span
            class={`inline-flex items-center font-bold rounded-full border ${variants[local.variant || "secondary"]} ${sizes[local.size || "md"]} ${local.class || ""}`}
            {...others}
        >
            {local.children}
        </span>
    );
}
