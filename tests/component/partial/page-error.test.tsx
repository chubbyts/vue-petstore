/** @jsxImportSource vue */

import { describe, expect, test } from 'vitest';
import { defineComponent, ref, shallowRef, watch } from 'vue';
import { render, screen } from '@testing-library/vue';
import { BadRequest, HttpError, InternalServerError, NetworkError, Unauthorized } from '../../../src/client/error';
import type { HttpError as HttpErrorType } from '../../../src/client/error';
import { PageError } from '../../../src/component/partial/page-error';
import { PageErrorProvider, usePageError } from '../../../src/hook/use-page-error';

const authenticationError = new HttpError({ title: 'Authentication failed', detail: 'Failed to fetch' });

const Page = defineComponent(
  (props: { httpError?: HttpErrorType; focus?: boolean; invalidField?: boolean }) => {
    usePageError(() => props.httpError, { focus: () => props.focus ?? false });

    const inputRef = ref<HTMLInputElement | null>(null);

    // like a form, which focuses the first invalid field after a failed save
    watch(
      () => props.httpError,
      () => inputRef.value?.focus(),
      { flush: 'post' },
    );

    return () => (props.invalidField ? <input ref={inputRef} aria-label="Name" aria-invalid="true" /> : null);
  },
  {
    name: 'Page',
    props: ['httpError', 'focus', 'invalidField'],
  },
);

const renderPageError = ({
  httpError,
  pageHttpError,
  focus,
  invalidField,
}: {
  httpError?: HttpErrorType;
  pageHttpError?: HttpErrorType;
  focus?: boolean;
  invalidField?: boolean;
}) =>
  render(() => (
    <PageErrorProvider>
      <PageError httpError={httpError} />
      <Page httpError={pageHttpError} focus={focus} invalidField={invalidField} />
    </PageErrorProvider>
  ));

const errorTexts = () => screen.queryAllByTestId('http-error').map((element) => element.textContent);

describe('page-error', () => {
  test('without error', () => {
    renderPageError({});

    expect(errorTexts()).toEqual([]);
  });

  test('error of the page', async () => {
    renderPageError({
      pageHttpError: new BadRequest({ title: 'Bad Request', invalidParameters: [{ name: 'name', reason: 'empty' }] }),
    });

    await screen.findByTestId('http-error');

    expect(errorTexts()).toEqual(['400 Bad Requestname: empty']);

    // not focusable, the focus stays where it is (e.g. a page that couldn't be loaded)
    const error = screen.getByTestId('http-error');
    expect(error.hasAttribute('tabindex')).toBe(false);
    expect(document.activeElement).not.toBe(error);
  });

  test('given error only', () => {
    renderPageError({ httpError: authenticationError });

    expect(errorTexts()).toEqual(['Authentication failedFailed to fetch']);
  });

  test.each([
    ['network error', new NetworkError({ title: 'Failed to fetch' })],
    ['unauthorized', new Unauthorized({ title: 'Unauthorized' })],
  ])('given error hides the error of the page caused by it: %s', async (_, pageHttpError) => {
    renderPageError({ httpError: authenticationError, pageHttpError, focus: true });

    await new Promise((resolve) => setTimeout(resolve));

    expect(errorTexts()).toEqual(['Authentication failedFailed to fetch']);
  });

  test('given error first, followed by the error of the page not caused by it', async () => {
    renderPageError({
      httpError: authenticationError,
      pageHttpError: new InternalServerError({ title: 'Internal Server Error' }),
    });

    await screen.findByText('500 Internal Server Error');

    expect(errorTexts()).toEqual(['Authentication failedFailed to fetch', '500 Internal Server Error']);
  });

  test('error of an action gets the focus', async () => {
    renderPageError({ pageHttpError: new InternalServerError({ title: 'Internal Server Error' }), focus: true });

    const error = await screen.findByTestId('http-error');
    expect(error.getAttribute('tabindex')).toBe('-1');
    expect(document.activeElement).toBe(error);
  });

  test('error of an action does not take the focus from an invalid field', async () => {
    // reported after the page got mounted, like a failed save
    const pageHttpError = shallowRef<HttpErrorType | undefined>(undefined);

    render(() => (
      <PageErrorProvider>
        <PageError />
        <Page httpError={pageHttpError.value} focus invalidField />
      </PageErrorProvider>
    ));

    // oxlint-disable-next-line functional/immutable-data
    pageHttpError.value = new BadRequest({
      title: 'Bad Request',
      invalidParameters: [{ name: 'name', reason: 'empty' }],
    });

    await screen.findByTestId('http-error');
    await new Promise((resolve) => setTimeout(resolve));

    expect(document.activeElement).toBe(screen.getByRole('textbox', { name: 'Name' }));
  });
});
