import { HttpStatusCode } from "@solidjs/start";

interface GlobalErrorFallbackProps {
    error: any;
    reset: () => void;
}

/**
 * Full-page crash screen. Used as the fallback for the app-root boundary.
 * Because this is triggered by a fatal application-level error, we use a hard
 * page reload rather than a SolidJS reset(), which may re-encounter the same
 * unrecoverable state.
 */
export function GlobalErrorFallback(props: GlobalErrorFallbackProps) {
    return (
        <div class="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-8 text-center">
            <HttpStatusCode code={500} />

            {/* Icon */}
            <div class="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-red-50 border border-red-100">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="36"
                    height="36"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="text-red-500"
                >
                    <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                    <line x1="12" y1="9" x2="12" y2="13" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
            </div>

            {/* Heading */}
            <h1 class="mb-2 text-2xl font-bold text-slate-900">
                Application Error
            </h1>
            <p class="mb-1 text-sm text-slate-500 max-w-sm">
                An unexpected error has occurred. The application cannot continue.
            </p>
            <p class="mb-8 font-mono text-xs text-red-400 bg-red-50 border border-red-100 rounded-lg px-3 py-1.5 max-w-sm break-all">
                {props.error?.message || "Unknown error"}
            </p>

            {/* Action */}
            <button
                onClick={() => window.location.reload()}
                class="inline-flex items-center gap-2 rounded-lg bg-primary-green-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-green-500 focus:ring-offset-2"
            >
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
                >
                    <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
                </svg>
                Reload Application
            </button>
        </div>
    );
}
