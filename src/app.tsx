import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import { MetaProvider } from "@solidjs/meta";
import { SafeErrorBoundary, GlobalErrorFallback } from "~/components/errors";
import { LoadingFallback } from "~/components/ui/LoadingFallback";
import "./app.css";

export default function App() {
  return (
    <Router
      root={props => (
        <MetaProvider>
          <SafeErrorBoundary fallback={(err, reset) => <GlobalErrorFallback error={err} reset={reset} />}>
            <Suspense fallback={<LoadingFallback />}>{props.children}</Suspense>
          </SafeErrorBoundary>
        </MetaProvider>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
