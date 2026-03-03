import { JSX } from "solid-js";

export function ChevronRightIcon(props: JSX.SvgSVGAttributes<SVGSVGElement>) {
    return (
        <svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" {...props}>
            <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
    );
}
