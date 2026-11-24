/** @jsxImportSource vue */

import type { Component } from 'vue';
import { defineComponent } from 'vue';
import type { RouteRecordRaw } from 'vue-router';
import { createMemoryHistory, createRouter, RouterView } from 'vue-router';
import { render } from '@testing-library/vue';
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query';
import { ToastProvider } from '../src/hook/use-toast';
import { PageErrorProvider } from '../src/hook/use-page-error';
import { PageError } from '../src/component/partial/page-error';

// a page of a route not under test (e.g. the target of a link)
export const mockPage = (testId: string): Component => defineComponent(() => () => <div data-testid={testId} />);

export const renderRoute = async ({
  path,
  url,
  component,
  routes = [],
}: {
  path: string;
  // several: the history, the last one is the current
  url: string | Array<string>;
  component: Component;
  routes?: Array<RouteRecordRaw>;
}) => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

  const router = createRouter({
    history: createMemoryHistory(),
    routes: [{ path, component }, ...routes],
  });

  for (const currentUrl of Array.isArray(url) ? url : [url]) {
    // oxlint-disable-next-line functional/immutable-data
    await router.push(currentUrl);
  }

  return {
    queryClient,
    router,
    ...render(
      () => (
        <ToastProvider>
          {/* like in the app: the error of the page is shown on top of it */}
          <PageErrorProvider>
            <PageError />
            <RouterView />
          </PageErrorProvider>
        </ToastProvider>
      ),
      {
        global: {
          plugins: [[VueQueryPlugin, { queryClient }], router],
        },
      },
    ),
  };
};
