import { ErrorBoundary, JSX } from "solid-js";

interface SafeErrorBoundaryProps {
    fallback: (err: any, reset: () => void) => JSX.Element;
    children: JSX.Element;
}

/**
 * A redirect-safe wrapper around Solid's ErrorBoundary.
 *
 * Solid Router uses `throw redirect(...)` to navigate — which throws a
 * `Response` object. A generic ErrorBoundary would catch this and show an
 * error UI instead of navigating. This component re-throws any `Response`
 * object so the Router can handle it correctly.
 */
export function SafeErrorBoundary(props: SafeErrorBoundaryProps) {
    return (
        <ErrorBoundary
            fallback={(err, reset) => {
                // Re-throw Solid Router redirects — they must not be intercepted
                if (err instanceof Response) throw err;
                return props.fallback(err, reset);
            }}
        >
            {props.children}
        </ErrorBoundary>
    );
}
