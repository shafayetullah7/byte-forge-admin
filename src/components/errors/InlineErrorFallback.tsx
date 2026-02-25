import { HttpStatusCode } from "@solidjs/start";
import { revalidate } from "@solidjs/router";
import { ApiError } from "~/lib/api/types";

interface InlineErrorFallbackProps {
    error: any;
    reset: () => void;
    /** Optional label for what failed, e.g. "tag groups" or "category tree" */
    label?: string;
}

/**
 * Compact section-level error card. Used to wrap individual <Suspense> blocks
 * inside page layouts (e.g. metrics panel, data grid, tree view).
 *
 * Keeps the blast radius minimal — only the failing section shows this UI;
 * the rest of the page is unaffected.
 */
export function InlineErrorFallback(props: InlineErrorFallbackProps) {
    const statusCode = () =>
        props.error instanceof ApiError ? props.error.status : 500;

    const message = () => {
        const code = statusCode();
        const what = props.label ?? "data";
        if (code === 404) return `The requested ${what} could not be found.`;
        if (code === 403) return `You do not have permission to view this ${what}.`;
        if (code === 503) return `The server is temporarily unavailable. Please try again shortly.`;
        return `Failed to load ${what}. Check your connection and try again.`;
    };

    // Allow retry only for transient errors, not permission/not-found errors
    const canRetry = () => ![403, 404].includes(statusCode());

    function handleRetry() {
        revalidate(); // Flush Solid Router cache before remounting
        props.reset();
    }

    return (
        <div class="flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3.5">
            <HttpStatusCode code={statusCode()} />

            {/* Icon */}
            <div class="mt-0.5 flex-shrink-0">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="text-red-500"
                >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
            </div>

            {/* Content */}
            <div class="flex flex-1 flex-col gap-1 min-w-0">
                <div class="flex items-center justify-between gap-2">
                    <p class="text-sm font-semibold text-red-700 leading-snug">
                        {message()}
                    </p>
                    <span class="flex-shrink-0 rounded-md bg-red-100 px-1.5 py-0.5 font-mono text-xs font-medium text-red-600">
                        {statusCode()}
                    </span>
                </div>

                {props.error?.message && (
                    <p class="truncate font-mono text-xs text-red-400">
                        {props.error.message}
                    </p>
                )}

                {canRetry() && (
                    <button
                        onClick={handleRetry}
                        class="mt-1 self-start inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-800 transition-colors underline-offset-2 hover:underline"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="11"
                            height="11"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        >
                            <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
                        </svg>
                        Retry
                    </button>
                )}
            </div>
        </div>
    );
}
