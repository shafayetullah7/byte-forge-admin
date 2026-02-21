import { JSX } from "solid-js";

interface CardProps extends JSX.HTMLAttributes<HTMLDivElement> {
    children: JSX.Element;
}

export function Card(props: CardProps) {
    return (
        <div
            {...props}
            class={`bg-white rounded-xl border border-slate-200 shadow-sm relative overflow-hidden ${props.class || ""}`}
        >
            <div class="absolute top-0 left-0 right-0 h-1 bg-primary-green opacity-0 group-[.card-premium]:opacity-100 transition-opacity" />
            {props.children}
        </div>
    );
}
