import type { InjectionKey, SlotsType, VNode } from 'vue';
import { Teleport, defineComponent, inject, provide, shallowRef, watch } from 'vue';

export type ShowToast = (message: string) => void;

const ToastKey: InjectionKey<ShowToast> = Symbol('Toast');

// long enough to read a short message (also for slower readers)
export const toastDuration = 5000;

export const ToastProvider = defineComponent(
  (_props, { slots }) => {
    // wrapped in an object so showing the same message twice restarts the timer
    const toast = shallowRef<{ message: string } | undefined>(undefined);

    watch(toast, (currentToast, _, onCleanup) => {
      if (!currentToast) {
        return;
      }

      const timeout = setTimeout(() => {
        // oxlint-disable-next-line functional/immutable-data
        toast.value = undefined;
      }, toastDuration);

      onCleanup(() => clearTimeout(timeout));
    });

    provide(ToastKey, (message: string) => {
      // oxlint-disable-next-line functional/immutable-data
      toast.value = { message };
    });

    return () => (
      <>
        {slots.default?.()}
        {/* outside of the app root, which is inert while a dialog is open (e.g. the "Deleted …" message) */}
        <Teleport to="body">
          <div role="status" class="pointer-events-none fixed right-6 bottom-6 z-50">
            {toast.value ? (
              <div
                data-testid="toast"
                class="rounded-control border-line-overlay bg-surface-hover text-fg border px-4 py-3 text-sm shadow-(--toast-shadow)"
              >
                {toast.value.message}
              </div>
            ) : null}
          </div>
        </Teleport>
      </>
    );
  },
  {
    name: 'ToastProvider',
    slots: Object as SlotsType<{ default?: () => VNode[] }>,
  },
);

export const useToast = (): ShowToast => {
  const showToast = inject(ToastKey, undefined);

  if (!showToast) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  return showToast;
};
