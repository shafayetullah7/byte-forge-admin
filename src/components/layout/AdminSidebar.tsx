import { For, Show } from "solid-js";
import { PottedPlantIcon } from "~/components/icons";
import { adminNavSections } from "~/config/admin-nav";
import { AdminNavLink } from "./AdminNavLink";

export function AdminSidebar() {
  return (
    <aside class="w-[240px] bg-primary-green-950 flex flex-col h-full flex-shrink-0 text-primary-green-50 border-r border-primary-green-900">
      <div class="h-[60px] flex items-center px-6 border-b border-primary-green-900">
        <PottedPlantIcon class="w-7 h-7 text-primary-green-400 mr-2" />
        <span class="text-white font-bold text-lg tracking-wide">ByteForge</span>
      </div>

      <nav class="flex-1 overflow-y-auto py-6">
        <For each={adminNavSections}>
          {(section) => {
            const visibleItems = () => section.items.filter((item) => item.enabled !== false);

            return (
              <Show when={visibleItems().length > 0}>
                <div class="px-5 mb-3 text-xs font-semibold text-primary-green-500 uppercase tracking-widest">
                  {section.title}
                </div>
                <For each={visibleItems()}>{(item) => <AdminNavLink item={item} />}</For>
              </Show>
            );
          }}
        </For>
      </nav>

      <div class="p-4 border-t border-primary-green-900 text-xs text-primary-green-500 text-center">
        Admin Panel
      </div>
    </aside>
  );
}
