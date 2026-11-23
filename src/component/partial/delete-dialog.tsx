import type { ComponentPublicInstance } from 'vue';
import { Teleport, defineComponent, onBeforeUnmount, onMounted, onUnmounted, ref, useId } from 'vue';
import { Button } from '../button';

// the element the app is rendered into (see index.html), made inert while the dialog is open
export const appRootId = 'root';

// the content, focused if the element that opened the dialog is gone (e.g. the deleted row)
export const mainId = 'main';

export type DeleteDialogProps = {
  name: string;
  isPending: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export const DeleteDialog = defineComponent(
  (props: DeleteDialogProps) => {
    const titleId = useId();
    const descriptionId = useId();
    const cancelRef = ref<ComponentPublicInstance | null>(null);

    // modal: the app behind can't be reached (tab, pointer, screen readers), focus starts on the safe choice
    // and returns to the element that opened the dialog when it closes
    const opener = document.activeElement as HTMLElement | null;
    const appRoot = document.getElementById(appRootId);

    // on the document: also works if the focus left the dialog (e.g. a click on the backdrop)
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        props.onCancel();
      }
    };

    onMounted(() => {
      appRoot?.setAttribute('inert', '');
      (cancelRef.value?.$el as HTMLElement | undefined)?.focus();
      document.addEventListener('keydown', onKeyDown);
    });

    onBeforeUnmount(() => {
      document.removeEventListener('keydown', onKeyDown);
      appRoot?.removeAttribute('inert');
    });

    // after the update: the row of the opener might be removed in the same one
    onUnmounted(() => {
      if (opener?.isConnected) {
        opener.focus();
      } else {
        document.getElementById(mainId)?.focus();
      }
    });

    return () => (
      <Teleport to="body">
        <div class="bg-overlay fixed inset-0 z-40 flex items-start justify-center px-4 pt-40 pb-4">
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={descriptionId}
            data-testid="delete-dialog"
            class="rounded-dialog border-line-overlay bg-surface flex w-full max-w-[420px] flex-col gap-3 border p-[22px] shadow-(--dialog-shadow)"
          >
            <h2 id={titleId} class="m-0 text-xl font-bold">
              Delete {props.name}?
            </h2>
            <p id={descriptionId} class="text-fg-muted m-0">
              This can’t be undone.
            </p>
            <div class="flex justify-end gap-2 pt-1.5">
              <Button ref={cancelRef} data-testid="delete-dialog-cancel" variant="secondary" onClick={props.onCancel}>
                Cancel
              </Button>
              <Button
                data-testid="delete-dialog-confirm"
                variant="danger"
                disabled={props.isPending}
                onClick={props.onConfirm}
              >
                Delete pet
              </Button>
            </div>
          </div>
        </div>
      </Teleport>
    );
  },
  {
    name: 'DeleteDialog',
    props: ['name', 'isPending', 'onCancel', 'onConfirm'],
  },
);
