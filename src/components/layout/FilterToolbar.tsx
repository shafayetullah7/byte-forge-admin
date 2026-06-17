import { children, Show, type JSX } from "solid-js";
import { Input } from "~/components/ui/Input";

export interface FilterToolbarProps {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  searchLabel?: string;
  children?: JSX.Element;
  class?: string;
}

function SearchIcon() {
  return (
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
      class="text-slate-400"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

export function FilterToolbar(props: FilterToolbarProps) {
  const resolvedChildren = children(() => props.children);

  return (
    <div
      class={`flex flex-col sm:flex-row gap-4 mb-6 items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm ${props.class ?? ""}`}
    >
      <Show when={props.onSearchChange}>
        <div class="relative w-full sm:max-w-[400px] flex-1">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon />
          </div>
          <Show
            when={props.searchLabel}
            fallback={
              <input
                type="text"
                class="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-green-500 focus:border-primary-green-500 outline-none transition-shadow"
                placeholder={props.searchPlaceholder ?? "Search..."}
                value={props.searchValue ?? ""}
                onInput={(e) => props.onSearchChange!(e.currentTarget.value)}
              />
            }
          >
            <Input
              label={props.searchLabel!}
              placeholder={props.searchPlaceholder ?? "Search..."}
              class="pl-10 w-full"
              value={props.searchValue ?? ""}
              onInput={(e) => props.onSearchChange!(e.currentTarget.value)}
            />
          </Show>
        </div>
      </Show>
      <Show when={resolvedChildren()}>
        <div class="flex items-center gap-2 sm:gap-3 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
          {resolvedChildren()}
        </div>
      </Show>
    </div>
  );
}
