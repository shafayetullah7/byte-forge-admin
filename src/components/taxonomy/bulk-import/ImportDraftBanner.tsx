import { Show } from "solid-js";
import { Button } from "~/components/ui/Button";

export function ImportDraftBanner(props: {
  visible: boolean;
  onResume: () => void;
  onDiscard: () => void;
}) {
  return (
    <Show when={props.visible}>
      <div class="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <p class="text-sm text-amber-900">
          Your import draft was restored from this browser session.
        </p>
        <div class="flex flex-wrap gap-2">
          <Button type="button" variant="outline" size="sm" onClick={props.onDiscard}>
            Start fresh
          </Button>
          <Button type="button" variant="primary" size="sm" onClick={props.onResume}>
            Continue
          </Button>
        </div>
      </div>
    </Show>
  );
}
