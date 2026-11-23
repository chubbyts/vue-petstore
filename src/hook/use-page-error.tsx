import type { InjectionKey, MaybeRefOrGetter, ShallowRef, SlotsType, VNode } from 'vue';
import { defineComponent, inject, onBeforeUnmount, provide, shallowRef, toValue, watch } from 'vue';
import type { HttpError } from '../client/error';

export type PageHttpError = {
  httpError: HttpError;
  // true for errors of actions (e.g. save, delete): the focus moves to the error, so it's noticed
  focus: boolean;
};

const PageErrorKey: InjectionKey<ShallowRef<PageHttpError | undefined>> = Symbol('PageError');

export const PageErrorProvider = defineComponent(
  (_, { slots }) => {
    provide(PageErrorKey, shallowRef<PageHttpError | undefined>(undefined));

    return () => slots.default?.();
  },
  {
    name: 'PageErrorProvider',
    slots: Object as SlotsType<{ default?: () => VNode[] }>,
  },
);

const usePageErrorContext = (): ShallowRef<PageHttpError | undefined> => {
  const pageError = inject(PageErrorKey, undefined);

  if (!pageError) {
    throw new Error('usePageError must be used within a PageErrorProvider');
  }

  return pageError;
};

// reports the error of the current page, shown in one place on top of the content (see PageError),
// cleared when it's gone or the page is left
export const usePageError = (
  httpError: MaybeRefOrGetter<HttpError | null | undefined>,
  { focus = false }: { focus?: MaybeRefOrGetter<boolean> } = {},
): void => {
  const pageError = usePageErrorContext();

  watch(
    [() => toValue(httpError), () => toValue(focus)],
    ([currentHttpError, currentFocus]) => {
      // oxlint-disable-next-line functional/immutable-data
      pageError.value = currentHttpError ? { httpError: currentHttpError, focus: currentFocus } : undefined;
    },
    { immediate: true },
  );

  // before the next page is set up: it reports its own error
  onBeforeUnmount(() => {
    // oxlint-disable-next-line functional/immutable-data
    pageError.value = undefined;
  });
};

export const useCurrentPageError = (): Readonly<ShallowRef<PageHttpError | undefined>> => usePageErrorContext();
