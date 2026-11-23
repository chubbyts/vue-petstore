/** @jsxImportSource vue */

import { test, expect, vi, describe } from 'vitest';
import { render, screen } from '@testing-library/vue';
import { createMemoryHistory, createRouter, RouterView } from 'vue-router';
import { defineComponent } from 'vue';
import { routes } from '../src/routes';

vi.mock('../src/component/page/home', () => ({
  default: defineComponent(() => () => <div data-testid="page-home-mock" />),
}));

vi.mock('../src/component/page/pet/list', () => ({
  default: defineComponent(() => () => <div data-testid="page-pet-list-mock" />),
}));

vi.mock('../src/component/page/pet/create', () => ({
  default: defineComponent(() => () => <div data-testid="page-pet-create-mock" />),
}));

vi.mock('../src/component/page/pet/read', () => ({
  default: defineComponent(() => () => <div data-testid="page-pet-read-mock" />),
}));

vi.mock('../src/component/page/pet/update', () => ({
  default: defineComponent(() => () => <div data-testid="page-pet-update-mock" />),
}));

vi.mock('../src/component/page/not-found', () => ({
  default: defineComponent(() => () => <div data-testid="page-not-found-mock" />),
}));

const renderUrl = async (url: string) => {
  const router = createRouter({ history: createMemoryHistory(), routes });

  // oxlint-disable-next-line functional/immutable-data
  await router.push(url);

  return render(<RouterView />, { global: { plugins: [router] } });
};

describe('routes', () => {
  test.each([
    ['/', 'page-home-mock'],
    ['/pet', 'page-pet-list-mock'],
    ['/pet/create', 'page-pet-create-mock'],
    ['/pet/4d783b77-eb09-4603-b99b-f590b605eaa9', 'page-pet-read-mock'],
    ['/pet/4d783b77-eb09-4603-b99b-f590b605eaa9/update', 'page-pet-update-mock'],
    ['/unknown', 'page-not-found-mock'],
  ])('%s', async (url, testId) => {
    const { container } = await renderUrl(url);

    await screen.findByTestId(testId);

    expect(container.innerHTML).toBe(`<div data-testid="${testId}"></div>`);
  });
});
