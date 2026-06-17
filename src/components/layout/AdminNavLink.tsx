import { A } from "@solidjs/router";
import { Show } from "solid-js";
import type { NavItem } from "~/config/admin-nav";

const linkBaseClass =
  "flex items-center px-4 py-3 transition-colors duration-200 rounded-lg mx-2 mb-1 group text-sm font-medium";
const linkActiveClass =
  "bg-primary-green-800 text-white font-semibold outline outline-1 outline-primary-green-700/50";
const linkInactiveClass = "text-primary-green-200 hover:bg-primary-green-900 hover:text-white";
const iconBaseClass =
  "w-5 h-5 mr-3 text-primary-green-400 group-hover:text-primary-green-200 group-aria-[current=page]:text-white";

export interface AdminNavLinkProps {
  item: NavItem;
}

export function AdminNavLink(props: AdminNavLinkProps) {
  const Icon = props.item.icon;

  return (
    <A
      href={props.item.href}
      class={linkBaseClass}
      activeClass={linkActiveClass}
      inactiveClass={linkInactiveClass}
      end={props.item.match === "exact"}
    >
      <Icon class={iconBaseClass} />
      {props.item.label}
      <Show when={props.item.badge !== undefined && props.item.badge! > 0}>
        <span class="ml-auto bg-amber-500/20 outline outline-1 outline-amber-500 text-amber-500 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
          {props.item.badge}
        </span>
      </Show>
    </A>
  );
}
