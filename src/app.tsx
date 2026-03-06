import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import { MetaProvider } from "@solidjs/meta";
import { SafeErrorBoundary, GlobalErrorFallback } from "~/components/errors";
import "./app.css";

function LoadingFallback() {
  return (
    <div class="min-h-screen flex items-center justify-center bg-slate-50">
      <div class="flex flex-col items-center gap-3">
        <div class="w-8 h-8 border-3 border-primary-green-600 border-t-transparent rounded-full animate-spin"></div>
        <span class="text-sm text-slate-500 font-medium">Loading...</span>
      </div>
    </div>
  );
}

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
