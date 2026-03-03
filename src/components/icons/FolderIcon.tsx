import { JSX } from "solid-js";

export function FolderIcon(props: JSX.SvgSVGAttributes<SVGSVGElement>) {
    return (
        <svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" {...props}>
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 15V9a2.25 2.25 0 00-2.25-2.25h-5.379a2.25 2.25 0 01-1.59-.659l-1.171-1.171a2.25 2.25 0 00-1.591-.66H4.5A2.25 2.25 0 002.25 6.6V15z" />
        </svg>
    );
}
