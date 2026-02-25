import { HttpStatusCode } from "@solidjs/start";
import { revalidate } from "@solidjs/router";
import { ApiError } from "~/lib/api/types";

interface PageErrorFallbackProps {
    error: any;
    reset: () => void;
}

/**
 * Layout-level error card. Used inside (protected).tsx's <main> block.
 * The sidebar and navbar are outside this boundary and remain fully functional.
 *
 * Retry strategy: revalidate() clears the Solid Router query cache first,
 * then reset() remounts the children so they actually re-fetch data.
 */
export function PageErrorFallback(props: PageErrorFallbackProps) {
    const statusCode = () =>
        props.error instanceof ApiError ? props.error.status : 500;

    const isNotFound = () => statusCode() === 404;
    const isForbidden = () => statusCode() === 403;

    const heading = () => {
        if (isNotFound()) return "Page Not Found";
        if (isForbidden()) return "Access Denied";
        return "Something Went Wrong";
    };

    const description = () => {
        if (isNotFound())
            return "The resource you are looking for does not exist or has been removed.";
        if (isForbidden())
            return "You do not have permission to access this page.";
        return "An error occurred while loading this page. You can retry or navigate to another section.";
    };

    function handleRetry() {
        revalidate(); // Clear all cached queries before remounting
        props.reset();
    }

    return (
        <div class="flex flex-1 items-center justify-center py-24">
            <HttpStatusCode code={statusCode()} />

            <div class="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">

                {/* Icon */}
                <div class="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-red-50 border border-red-100">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="26"
                        height="26"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="text-red-500"
                    >
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                </div>

                {/* Status Badge */}
                <span class="mb-3 inline-block rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-red-600 border border-red-100">
                    Error {statusCode()}
                </span>

                <h2 class="mb-2 text-lg font-bold text-slate-900">{heading()}</h2>
                <p class="mb-6 text-sm text-slate-500">{description()}</p>

                {/* Error detail (dev-friendly) */}
                {props.error?.message && (
                    <p class="mb-6 rounded-lg bg-slate-50 border border-slate-200 px-3 py-2 font-mono text-xs text-slate-500 break-all text-left">
                        {props.error.message}
                    </p>
                )}

                {/* Actions */}
                <div class="flex items-center justify-center gap-3">
                    <a
                        href="/"
                        class="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                    >
                        Go to Dashboard
                    </a>
                    {!isNotFound() && !isForbidden() && (
                        <button
                            onClick={handleRetry}
                            class="inline-flex items-center gap-1.5 rounded-lg bg-primary-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-green-500 focus:ring-offset-2"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="14"
                                height="14"
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
        </div>
    );
}
