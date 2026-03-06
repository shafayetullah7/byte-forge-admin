import { Show } from "solid-js";
import { A } from "@solidjs/router";
import { ArrowLeftIcon } from "../icons/ArrowLeftIcon";

interface FormHeaderProps {
    title: string;
    subtitle?: string;
    backHref?: string;
    backLabel?: string;
}

export function FormHeader(props: FormHeaderProps) {
    return (
        <div class="mb-8">
            <Show when={props.backHref}>
                <A
                    href={props.backHref!}
                    class="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-primary-green-700 transition-colors mb-4"
                >
                    <ArrowLeftIcon width="16" height="16" />
                    {props.backLabel || "Back"}
                </A>
            </Show>
            <div>
                <h1 class="text-2xl font-bold text-slate-900">{props.title}</h1>
                <Show when={props.subtitle}>
                    <p class="text-sm text-slate-500 mt-1">{props.subtitle}</p>
                </Show>
            </div>
        </div>
    );
}
