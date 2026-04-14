import { JSX, Show, createEffect, onCleanup } from "solid-js";
import { Portal } from "solid-js/web";

interface ModalProps {
    show: boolean;
    onClose: () => void;
    title: string;
    children: JSX.Element;
    footer?: JSX.Element;
    labelledBy?: string;
    describedBy?: string;
}

export function Modal(props: ModalProps) {
    let modalContentRef: HTMLDivElement | undefined;

    // Handle Escape key and prevent body scroll
    createEffect(() => {
        if (props.show) {
            const handleEsc = (e: KeyboardEvent) => {
                if (e.key === "Escape") props.onClose();
            };
            window.addEventListener("keydown", handleEsc);
            document.body.style.overflow = "hidden";
            
            // Focus first focusable element
            const firstFocusable = modalContentRef?.querySelector(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            ) as HTMLElement;
            firstFocusable?.focus();
            
            onCleanup(() => {
                window.removeEventListener("keydown", handleEsc);
                document.body.style.overflow = "";
            });
        }
    });

    return (
        <Show when={props.show}>
            <Portal mount={document.body}>
                <div 
                    class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby={props.labelledBy || "modal-title"}
                    aria-describedby={props.describedBy}
                >
                    {/* Backdrop */}
                    <div
                        class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
                        onClick={props.onClose}
                    />

                    {/* Modal Content */}
                    <div 
                        ref={modalContentRef!}
                        class="relative w-full max-w-lg transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all border border-slate-100 max-h-[90vh] flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div id="modal-title" class="flex items-center justify-between border-b border-slate-100 px-6 py-4 flex-shrink-0">
                            <h3 class="text-lg font-bold text-slate-900">{props.title}</h3>
                            <button
                                onClick={props.onClose}
                                class="rounded-lg p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors"
                                aria-label="Close modal"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M18 6 6 18M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Body */}
                        <div class="px-6 py-6 overflow-y-auto custom-scrollbar flex-1 min-h-0">
                            {props.children}
                        </div>

                        {/* Footer */}
                        <Show when={props.footer}>
                            <div class="flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50/50 px-6 py-4 flex-shrink-0">
                                {props.footer}
                            </div>
                        </Show>
                    </div>
                </div>
            </Portal>
        </Show>
    );
}
