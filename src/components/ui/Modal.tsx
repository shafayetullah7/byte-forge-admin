import { JSX, Show, onCleanup, onMount } from "solid-js";
import { Portal } from "solid-js/web";

interface ModalProps {
    show: boolean;
    onClose: () => void;
    title: string;
    children: JSX.Element;
    footer?: JSX.Element;
}

export function Modal(props: ModalProps) {
    // Prevent scrolling when modal is open
    onMount(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") props.onClose();
        };
        window.addEventListener("keydown", handleEsc);
        onCleanup(() => window.removeEventListener("keydown", handleEsc));
    });

    return (
        <Show when={props.show}>
            <Portal>
                <div class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                    {/* Backdrop */}
                    <div
                        class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
                        onClick={props.onClose}
                    />

                    {/* Modal Content */}
                    <div class="relative w-full max-w-lg transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all border border-slate-100">
                        {/* Header */}
                        <div class="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                            <h3 class="text-lg font-bold text-slate-900">{props.title}</h3>
                            <button
                                onClick={props.onClose}
                                class="rounded-lg p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M18 6 6 18M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Body */}
                        <div class="px-6 py-6">
                            {props.children}
                        </div>

                        {/* Footer */}
                        <Show when={props.footer}>
                            <div class="flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50/50 px-6 py-4">
                                {props.footer}
                            </div>
                        </Show>
                    </div>
                </div>
            </Portal>
        </Show>
    );
}
