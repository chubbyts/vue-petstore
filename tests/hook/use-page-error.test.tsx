/** @jsxImportSource vue */

import { afterEach, describe, expect, test, vi } from 'vitest';
import { render, screen } from '@testing-library/vue';
import { userEvent } from '@testing-library/user-event';
import { defineComponent, nextTick, ref } from 'vue';
import { BadRequest, NetworkError } from '../../src/client/error';
import type { HttpError } from '../../src/client/error';
import { PageErrorProvider, useCurrentPageError, usePageError } from '../../src/hook/use-page-error';

const CurrentPageError = defineComponent(() => {
  const pageError = useCurrentPageError();

  return () => (
    <span data-testid="current">
      {pageError.value ? `${pageError.value.httpError.title} ${String(pageError.value.focus)}` : 'none'}
    </span>
  );
});

type Options = { focus?: boolean };

const Page = defineComponent(
  (props: { httpError?: HttpError; options?: Options }) => {
    usePageError(() => props.httpError, { focus: () => props.options?.focus ?? false });

    return () => null;
  },
  { props: ['httpError', 'options'] },
);

const App = defineComponent(
  (props: { httpError?: HttpError; options?: Options }) => {
    const showPage = ref(true);

    return () => (
      <PageErrorProvider>
        <CurrentPageError />
        {showPage.value ? <Page httpError={props.httpError} options={props.options} /> : null}
        {/* oxlint-disable-next-line functional/immutable-data */}
        <button onClick={() => (showPage.value = false)}>leave</button>
      </PageErrorProvider>
    );
  },
  { props: ['httpError', 'options'] },
);

describe('use-page-error', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('without provider', () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});

    const UsePageError = defineComponent(() => {
      usePageError(undefined);

      return () => null;
    });

    const UseCurrentPageError = defineComponent(() => {
      useCurrentPageError();

      return () => null;
    });

    expect(() => render(<UsePageError />)).toThrow('usePageError must be used within a PageErrorProvider');
    expect(() => render(<UseCurrentPageError />)).toThrow('usePageError must be used within a PageErrorProvider');
  });

  test('without error', () => {
    render(<App />);

    expect(screen.getByTestId('current').textContent).toBe('none');
  });

  test('reports the error, replaces it and clears it when the page is left', async () => {
    const { rerender } = render(App, { props: { httpError: new NetworkError({ title: 'Failed to fetch' }) } });

    // reported while the page is set up: shown with the next render
    await nextTick();

    // default: don't move the focus
    expect(screen.getByTestId('current').textContent).toBe('Failed to fetch false');

    await rerender({ httpError: new BadRequest({ title: 'Bad Request' }), options: { focus: true } });

    expect(screen.getByTestId('current').textContent).toBe('Bad Request true');

    await rerender({ httpError: undefined, options: undefined });

    expect(screen.getByTestId('current').textContent).toBe('none');

    await rerender({ httpError: new NetworkError({ title: 'Failed to fetch' }) });

    expect(screen.getByTestId('current').textContent).toBe('Failed to fetch false');

    await userEvent.click(screen.getByRole('button', { name: 'leave' }));

    expect(screen.getByTestId('current').textContent).toBe('none');
  });
});
