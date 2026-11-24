import type { ComponentPublicInstance } from 'vue';
import { computed, defineComponent, nextTick, ref, watch } from 'vue';
import type { HttpError } from '../../client/error';
import { NetworkError, Unauthorized } from '../../client/error';
import { useCurrentPageError } from '../../hook/use-page-error';
import { HttpError as HttpErrorPartial } from './http-error';

// errors of the page that are most likely caused by an authentication error, and would only repeat it
const isConsequenceOfAuthenticationError = (httpError: HttpError): boolean =>
  httpError instanceof Unauthorized || httpError instanceof NetworkError;

export type PageErrorProps = {
  // e.g. authentication failed: shown first, the error of the page is only shown if it's not caused by it
  httpError?: HttpError;
};

// the errors in one place: on top of the content
export const PageError = defineComponent(
  (props: PageErrorProps) => {
    const currentPageError = useCurrentPageError();

    const pageError = computed(() =>
      currentPageError.value &&
      !(props.httpError && isConsequenceOfAuthenticationError(currentPageError.value.httpError))
        ? currentPageError.value
        : undefined,
    );

    const pageErrorRef = ref<ComponentPublicInstance | null>(null);

    // errors of actions (e.g. save) get the focus (and are scrolled into view), so they're noticed,
    // unless the focus is on an invalid field already (moved there by the form)
    // once rendered: the error might be reported while another component gets mounted (e.g. the page)
    watch(pageError, (shownPageError) => {
      if (!shownPageError?.focus) {
        return;
      }

      void nextTick(() => {
        if (!document.activeElement?.matches('[aria-invalid="true"]')) {
          (pageErrorRef.value?.$el as HTMLElement | undefined)?.focus();
        }
      });
    });

    return () => (
      <>
        {props.httpError ? <HttpErrorPartial httpError={props.httpError} /> : null}
        {pageError.value ? (
          <HttpErrorPartial
            ref={pageErrorRef}
            // focusable by script only, not in the tab order: it's not interactive
            tabindex={pageError.value.focus ? -1 : undefined}
            httpError={pageError.value.httpError}
          />
        ) : null}
      </>
    );
  },
  {
    name: 'PageError',
    props: ['httpError'],
  },
);
