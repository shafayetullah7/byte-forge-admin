import { createEffect, createSignal, type Accessor } from "solid-js";

export function useDebouncedSignal<T>(source: Accessor<T>, delay = 300): Accessor<T> {
  const [debounced, setDebounced] = createSignal(source());

  createEffect(() => {
    const value = source();
    const timer = setTimeout(() => setDebounced(() => value), delay);
    return () => clearTimeout(timer);
  });

  return debounced;
}
