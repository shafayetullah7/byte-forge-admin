import { children, Show, type JSX } from "solid-js";

export interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: JSX.Element;
  leading?: JSX.Element;
  class?: string;
}

export function PageHeader(props: PageHeaderProps) {
  const leading = children(() => props.leading);
  const actions = children(() => props.actions);

  return (
    <div
      class={`flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 ${props.class ?? ""}`}
    >
      <div class="flex items-start gap-4">
        {leading()}
        <div>
          <h1 class="text-2xl font-bold text-slate-900">{props.title}</h1>
          {props.description && (
            <p class="text-sm text-slate-500 mt-1 max-w-2xl">{props.description}</p>
          )}
        </div>
      </div>
      <Show when={actions()}>
        <div class="flex gap-3">{actions()}</div>
      </Show>
    </div>
  );
}
