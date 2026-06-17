import { children, Show, type JSX } from "solid-js";

export interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: (props: { class?: string }) => JSX.Element;
  class?: string;
  children?: JSX.Element;
}

export function PageHeader(props: PageHeaderProps) {
  const actions = children(() => props.children);
  const Icon = props.icon;

  return (
    <div
      class={`flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 ${props.class ?? ""}`}
    >
      <div class="flex items-start gap-4">
        {Icon && (
          <div class="w-12 h-12 rounded-xl bg-primary-green-700 flex items-center justify-center shadow-sm flex-shrink-0">
            <Icon class="w-6 h-6 text-white" />
          </div>
        )}
        <div>
          <h1 class="text-2xl font-bold text-slate-900">{props.title}</h1>
          {props.description && (
            <p class="text-sm text-slate-500 mt-1 max-w-2xl">{props.description}</p>
          )}
        </div>
      </div>
      <Show when={actions()}>
        <div class="flex flex-wrap gap-3">{actions()}</div>
      </Show>
    </div>
  );
}
