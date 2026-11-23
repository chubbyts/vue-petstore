import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { render } from '@testing-library/vue';
import { defineComponent, nextTick } from 'vue';
import { themeStorageKey, useTheme } from '../../src/hook/use-theme';

const createMedia = (matches: boolean) => {
  const listeners = new Set<() => void>();

  const media = {
    matches,
    addEventListener: vi.fn((_: string, listener: () => void) => listeners.add(listener)),
    removeEventListener: vi.fn((_: string, listener: () => void) => listeners.delete(listener)),
    change: (newMatches: boolean) => {
      // oxlint-disable-next-line functional/immutable-data
      media.matches = newMatches;
      listeners.forEach((listener) => listener());
    },
    listeners,
  };

  vi.spyOn(window, 'matchMedia').mockReturnValue(media as unknown as MediaQueryList);

  return media;
};

const theme = () => document.documentElement.getAttribute('data-theme');

// the hook within a component, like renderHook
const renderUseTheme = () => {
  const result: { current?: ReturnType<typeof useTheme> } = {};

  const { unmount } = render(
    defineComponent(() => {
      // oxlint-disable-next-line functional/immutable-data
      result.current = useTheme();

      return () => null;
    }),
  );

  return { result: result as { current: ReturnType<typeof useTheme> }, unmount };
};

describe('use-theme', () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('system preference follows the system setting', () => {
    const media = createMedia(true);

    const { result, unmount } = renderUseTheme();

    expect(result.current[0].value).toBe('system');
    expect(theme()).toBe('light');
    expect(window.localStorage.getItem(themeStorageKey)).toBeNull();

    media.change(false);

    expect(theme()).toBe('dark');

    unmount();

    expect(media.listeners.size).toBe(0);
  });

  test('explicit choice is applied, stored and ignores the system setting', async () => {
    const media = createMedia(false);

    const { result } = renderUseTheme();

    result.current[1]('light');
    await nextTick();

    expect(result.current[0].value).toBe('light');
    expect(theme()).toBe('light');
    expect(window.localStorage.getItem(themeStorageKey)).toBe('light');
    expect(media.listeners.size).toBe(0);

    media.change(false);

    expect(theme()).toBe('light');

    result.current[1]('dark');
    await nextTick();

    expect(theme()).toBe('dark');
    expect(window.localStorage.getItem(themeStorageKey)).toBe('dark');

    result.current[1]('system');
    await nextTick();

    expect(theme()).toBe('dark');
    expect(window.localStorage.getItem(themeStorageKey)).toBeNull();
    expect(media.listeners.size).toBe(1);
  });

  test('restores a stored choice and ignores invalid values', () => {
    createMedia(false);

    window.localStorage.setItem(themeStorageKey, 'light');

    expect(renderUseTheme().result.current[0].value).toBe('light');
    expect(theme()).toBe('light');

    window.localStorage.setItem(themeStorageKey, 'purple');

    expect(renderUseTheme().result.current[0].value).toBe('system');
  });

  test('works without storage', async () => {
    createMedia(true);

    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('storage disabled');
    });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('storage disabled');
    });

    const { result } = renderUseTheme();

    expect(result.current[0].value).toBe('system');
    expect(theme()).toBe('light');

    result.current[1]('dark');
    await nextTick();

    expect(theme()).toBe('dark');
  });
});
