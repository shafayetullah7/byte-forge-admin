import { Component, Show, createEffect, createSignal, type Accessor } from "solid-js";

export interface ImageUploadProps {
  preview?: string | null;
  isUploading: Accessor<boolean>;
  isDeleting?: Accessor<boolean>;
  error?: string | null;
  onFileSelect: (file: File) => void;
  onDelete?: () => void;
  disabled?: boolean;
  label?: string;
  description?: string;
  accept?: string;
  maxSizeMB?: number;
}

export const ImageUpload: Component<ImageUploadProps> = (props) => {
  let fileInputRef: HTMLInputElement | undefined;
  const [localPreview, setLocalPreview] = createSignal<string | null>(null);

  const previewUrl = () => props.preview ?? localPreview();
  const hasFile = () => !!(props.preview || localPreview());

  createEffect(() => {
    if (props.preview) {
      setLocalPreview(null);
    }
  });

  const handleChange = (e: Event & { currentTarget: HTMLInputElement }) => {
    const file = e.currentTarget.files?.[0];
    if (!file) return;

    if (props.maxSizeMB && file.size > props.maxSizeMB * 1024 * 1024) {
      if (fileInputRef) fileInputRef.value = "";
      return;
    }

    if (!props.preview) {
      setLocalPreview(URL.createObjectURL(file));
    }

    props.onFileSelect(file);
    if (fileInputRef) fileInputRef.value = "";
  };

  const handleDelete = (e: MouseEvent) => {
    e.stopPropagation();
    setLocalPreview(null);
    if (fileInputRef) fileInputRef.value = "";
    props.onDelete?.();
  };

  return (
    <div class="space-y-2">
      <Show when={props.label}>
        <label class="block text-xs font-semibold uppercase tracking-wider text-slate-500">
          {props.label}
        </label>
      </Show>

      <div
        class={`relative rounded-xl border-2 border-dashed transition-colors ${
          props.disabled
            ? "border-slate-200 bg-slate-50 cursor-not-allowed"
            : "border-slate-200 bg-white hover:border-primary-green-300 cursor-pointer"
        }`}
        onClick={() => !props.disabled && fileInputRef?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          class="hidden"
          accept={props.accept ?? "image/jpeg,image/png,image/webp,image/gif"}
          disabled={props.disabled}
          onChange={handleChange}
        />

        <Show
          when={hasFile()}
          fallback={
            <div class="flex flex-col items-center justify-center py-10 px-4 text-center">
              <div class="w-12 h-12 rounded-full bg-primary-green-50 text-primary-green-700 flex items-center justify-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
              </div>
              <p class="text-sm font-medium text-slate-700">Click to upload logo</p>
              <p class="text-xs text-slate-400 mt-1">
                {props.description ?? `PNG, JPG, WEBP up to ${props.maxSizeMB ?? 3}MB`}
              </p>
              <Show when={props.isUploading()}>
                <p class="text-xs text-primary-green-700 mt-2">Uploading…</p>
              </Show>
            </div>
          }
        >
          <div class="p-4 flex items-center gap-4">
            <div class="w-16 h-16 rounded-lg border border-slate-200 overflow-hidden bg-slate-50 flex-shrink-0">
              <img src={previewUrl()!} alt="" class="w-full h-full object-contain p-1" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-slate-800 truncate">Logo uploaded</p>
              <p class="text-xs text-slate-500 mt-1">Click to replace</p>
              <Show when={props.isUploading()}>
                <p class="text-xs text-primary-green-700 mt-1">Uploading…</p>
              </Show>
            </div>
            <Show when={props.onDelete}>
              <button
                type="button"
                class="px-3 py-1.5 text-xs font-semibold text-red-600 border border-red-200 rounded-lg hover:bg-red-50 disabled:opacity-50"
                disabled={(props.isDeleting?.() ?? false) || props.isUploading()}
                onClick={handleDelete}
              >
                {(props.isDeleting?.() ?? false) ? "Removing…" : "Remove"}
              </button>
            </Show>
          </div>
        </Show>
      </div>

      <Show when={props.error}>
        <p class="text-xs text-red-600">{props.error}</p>
      </Show>
    </div>
  );
};
