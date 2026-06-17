export interface LoadingFallbackProps {
  fullScreen?: boolean;
}

export function LoadingFallback(props: LoadingFallbackProps) {
  const containerClass = props.fullScreen !== false
    ? "min-h-screen flex items-center justify-center bg-slate-50"
    : "flex items-center justify-center min-h-screen";

  return (
    <div class={containerClass}>
      <div class="flex flex-col items-center gap-3">
        <div class="w-8 h-8 border-3 border-primary-green-600 border-t-transparent rounded-full animate-spin" />
        <span class="text-sm text-slate-500 font-medium">Loading...</span>
      </div>
    </div>
  );
}
