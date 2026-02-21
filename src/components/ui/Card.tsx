import { JSX } from "solid-js";

interface CardProps extends JSX.HTMLAttributes<HTMLDivElement> {
    children: JSX.Element;
}

export function Card(props: CardProps) {
    return (
        <div
            {...props}
            class={`bg-white rounded-lg border border-[var(--color-slate-200)] shadow-sm ${props.class || ""}`}
        >
            {props.children}
        </div>
    );
}
