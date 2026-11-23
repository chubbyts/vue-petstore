import type { MaybeRefOrGetter } from 'vue';
import { toValue, watchEffect } from 'vue';

export const appName = 'Petstore Admin';

// the title identifies the page and the app (browser tabs, history, announced by screen readers)
export const useDocumentTitle = (title: MaybeRefOrGetter<string>): void => {
  watchEffect(() => {
    // oxlint-disable-next-line functional/immutable-data
    document.title = `${toValue(title)} – ${appName}`;
  });
};
