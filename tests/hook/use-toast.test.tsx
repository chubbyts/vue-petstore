/** @jsxImportSource vue */

import { afterEach, describe, expect, test, vi } from 'vitest';
import { render, screen } from '@testing-library/vue';
import { defineComponent, nextTick } from 'vue';
import { ToastProvider, toastDuration, useToast } from '../../src/hook/use-toast';

const ShowToast = defineComponent(
  (props: { message: string }) => {
    const showToast = useToast();

    return () => (
      <button type="button" onClick={() => showToast(props.message)}>
        show
      </button>
    );
  },
  { props: ['message'] },
);

describe('use-toast', () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  test('without provider', () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});

    const UseToast = defineComponent(() => {
      useToast();

      return () => null;
    });

    expect(() => render(<UseToast />)).toThrow('useToast must be used within a ToastProvider');
  });

  test('shows and hides the toast', async () => {
    vi.useFakeTimers();

    render(
      <ToastProvider>
        <ShowToast message="Saved “Brownie” — 200 OK" />
      </ToastProvider>,
    );

    expect(screen.getByRole('status').textContent).toBe('');

    screen.getByRole('button').click();
    await nextTick();

    expect(screen.getByRole('status').textContent).toBe('Saved “Brownie” — 200 OK');

    vi.advanceTimersByTime(toastDuration - 1);
    await nextTick();

    // showing it again restarts the timer
    screen.getByRole('button').click();
    await nextTick();
    vi.advanceTimersByTime(toastDuration - 1);
    await nextTick();

    expect(screen.getByRole('status').textContent).toBe('Saved “Brownie” — 200 OK');

    vi.advanceTimersByTime(1);
    await nextTick();

    expect(screen.getByRole('status').textContent).toBe('');
  });
});
