import type { ParentComponent } from "solid-js";

export const PAGE_CONTAINER_CLASS = "mx-auto w-full max-w-[1400px] px-6";

export const PageShell: ParentComponent<{ class?: string }> = (props) => {
  return (
    <div class={`${PAGE_CONTAINER_CLASS} py-8 ${props.class ?? ""}`.trim()}>
      {props.children}
    </div>
  );
};
