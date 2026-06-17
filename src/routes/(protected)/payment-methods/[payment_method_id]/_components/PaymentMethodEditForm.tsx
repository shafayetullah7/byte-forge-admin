import { Show } from "solid-js";
import { Button } from "~/components/ui/Button";
import { Card } from "~/components/ui/Card";
import { Input } from "~/components/ui/Input";
import { ImageUpload } from "~/components/ui/ImageUpload";
import type { UseImageUploadReturn } from "~/lib/hooks/useImageUpload";

export interface PaymentMethodEditFormProps {
  methodKey: string;
  displayName: string;
  onDisplayNameChange: (value: string) => void;
  description: string;
  onDescriptionChange: (value: string) => void;
  logoUpload: UseImageUploadReturn;
  onLogoRemove: () => void | Promise<void>;
  errors: Record<string, string>;
  saveError: string | null;
  saving: boolean;
  onSubmit: (e: Event) => void;
  onBack: () => void;
}

export function PaymentMethodEditForm(props: PaymentMethodEditFormProps) {
  return (
    <Card class="p-6">
      <h2 class="text-base font-bold text-slate-900 mb-6">Edit details</h2>
      <form onSubmit={props.onSubmit} class="space-y-4">
        <Show when={props.saveError}>
          <div class="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
            {props.saveError}
          </div>
        </Show>
        <Input
          label="Display Name"
          value={props.displayName}
          onInput={(e) => props.onDisplayNameChange(e.currentTarget.value)}
          error={props.errors.displayName}
        />
        <ImageUpload
          label="Logo"
          preview={props.logoUpload.preview()}
          isUploading={props.logoUpload.isUploading}
          isDeleting={props.logoUpload.isDeleting}
          error={props.logoUpload.uploadError()}
          onFileSelect={props.logoUpload.upload}
          onDelete={props.onLogoRemove}
          maxSizeMB={3}
        />
        <div class="space-y-2">
          <label class="block text-xs font-semibold uppercase tracking-wider text-slate-500">
            Description
          </label>
          <textarea
            class="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm focus:border-primary-green-500 focus:outline-none focus:ring-2 focus:ring-primary-green-500/20 min-h-[80px] resize-y"
            value={props.description}
            onInput={(e) => props.onDescriptionChange(e.currentTarget.value)}
          />
        </div>
        <p class="text-xs text-slate-400">
          Key <span class="font-mono font-semibold">{props.methodKey}</span> cannot be changed after
          creation.
        </p>
        <div class="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={props.onBack}>
            Back
          </Button>
          <Button type="submit" variant="primary" isLoading={props.saving}>
            Save Changes
          </Button>
        </div>
      </form>
    </Card>
  );
}
