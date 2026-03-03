import { JSX } from "solid-js";

export function ArrowLeftIcon(props: JSX.SvgSVGAttributes<SVGSVGElement>) {
    return (
        <svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" {...props}>
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
        </svg>
    );
}
