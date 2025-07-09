/** @jsxImportSource vue */

import { test, expect, vi, describe } from 'vitest';
import { render, screen } from '@testing-library/vue';
import { userEvent } from '@testing-library/user-event';
import { createRouter, createWebHistory } from 'vue-router';
import { defineComponent } from 'vue';
import { routes } from '../src/routes';
import App from '../src/app';
import { formatHtml } from './formatter';

vi.mock('../src/component/page/home', () => {
  return {
    __esModule: true,
    default: defineComponent(() => () => <div data-testid="page-home-mock" />),
  };
});

vi.mock('../src/component/page/pet/list', () => {
  return {
    __esModule: true,
    default: defineComponent(() => () => <div data-testid="page-pet-list-mock" />),
  };
});

vi.mock('../src/component/page/pet/create', () => {
  return {
    __esModule: true,
    default: defineComponent(() => () => <div data-testid="page-pet-create-mock" />),
  };
});

vi.mock('../src/component/page/pet/read', () => {
  return {
    __esModule: true,
    default: defineComponent(() => () => <div data-testid="page-pet-read-mock" />),
  };
});

vi.mock('../src/component/page/pet/update', () => {
  return {
    __esModule: true,
    default: defineComponent(() => () => <div data-testid="page-pet-update-mock" />),
  };
});

vi.mock('../src/component/page/not-found', () => {
  return {
    __esModule: true,
    default: defineComponent(() => () => <div data-testid="page-not-found-mock" />),
  };
});

describe('app', () => {
  test('close navigation', () => {
    const router = createRouter({
      history: createWebHistory(),
      routes,
    });

    const { container } = render(<App />, {
      global: {
        plugins: [router],
      },
    });

    expect(formatHtml(container.outerHTML)).toMatchInlineSnapshot(`
    "<div>
      <div class="relative flex min-h-full flex-col md:flex-row">
        <nav
          class="absolute flow-root h-16 w-full bg-gray-900 px-4 py-3 text-2xl leading-relaxed font-semibold text-gray-100 uppercase"
        >
          <button
            class="float-right block border-2 p-2 md:hidden"
            data-testid="navigation-toggle"
          >
            <span class="block h-2 w-6 border-t-2"></span
            ><span class="block h-2 w-6 border-t-2"></span
            ><span class="block h-0 w-6 border-t-2"></span></button
          ><a href="/" class="hover:text-gray-500">Petstore</a>
        </nav>
        <nav
          class="mt-16 w-full bg-gray-200 md:block md:w-1/3 lg:w-1/4 xl:w-1/5 hidden"
        >
          <ul>
            <li>
              <a href="/pet" class=""
                ><span
                  class="block px-4 py-2 bg-gray-300 text-gray-900 hover:bg-gray-400"
                  >Petstore</span
                ></a
              >
            </li>
          </ul>
        </nav>
        <div class="w-full px-6 py-8 md:w-2/3 lg:w-3/4 xl:w-4/5 mt-16"><!----></div>
      </div>
    </div>
    "
  `);
  });

  test('open navigation', async () => {
    const router = createRouter({
      history: createWebHistory(),
      routes,
    });

    const { container } = render(<App />, {
      global: {
        plugins: [router],
      },
    });

    const navigationToggle = await screen.findByTestId('navigation-toggle');

    await userEvent.click(navigationToggle);

    expect(formatHtml(container.outerHTML)).toMatchInlineSnapshot(`
    "<div>
      <div class="relative flex min-h-full flex-col md:flex-row">
        <nav
          class="absolute flow-root h-16 w-full bg-gray-900 px-4 py-3 text-2xl leading-relaxed font-semibold text-gray-100 uppercase"
        >
          <button
            class="float-right block border-2 p-2 md:hidden"
            data-testid="navigation-toggle"
          >
            <span class="block h-2 w-6 border-t-2"></span
            ><span class="block h-2 w-6 border-t-2"></span
            ><span class="block h-0 w-6 border-t-2"></span></button
          ><a
            href="/"
            class="router-link-active router-link-exact-active hover:text-gray-500"
            aria-current="page"
            >Petstore</a
          >
        </nav>
        <nav
          class="mt-16 w-full bg-gray-200 md:block md:w-1/3 lg:w-1/4 xl:w-1/5 block"
        >
          <ul>
            <li>
              <a href="/pet" class=""
                ><span
                  class="block px-4 py-2 bg-gray-300 text-gray-900 hover:bg-gray-400"
                  >Petstore</span
                ></a
              >
            </li>
          </ul>
        </nav>
        <div class="w-full px-6 py-8 md:w-2/3 lg:w-3/4 xl:w-4/5 mt-0">
          <div data-testid="page-home-mock"></div>
        </div>
      </div>
    </div>
    "
  `);
  });

  test('not found', async () => {
    const router = createRouter({
      history: createWebHistory(),
      routes,
    });

    const { container } = render(<App />, {
      global: {
        plugins: [router],
      },
    });

    await router.push('/unknown');

    expect(formatHtml(container.outerHTML)).toMatchInlineSnapshot(`
    "<div>
      <div class="relative flex min-h-full flex-col md:flex-row">
        <nav
          class="absolute flow-root h-16 w-full bg-gray-900 px-4 py-3 text-2xl leading-relaxed font-semibold text-gray-100 uppercase"
        >
          <button
            class="float-right block border-2 p-2 md:hidden"
            data-testid="navigation-toggle"
          >
            <span class="block h-2 w-6 border-t-2"></span
            ><span class="block h-2 w-6 border-t-2"></span
            ><span class="block h-0 w-6 border-t-2"></span></button
          ><a href="/" class="hover:text-gray-500">Petstore</a>
        </nav>
        <nav
          class="mt-16 w-full bg-gray-200 md:block md:w-1/3 lg:w-1/4 xl:w-1/5 hidden"
        >
          <ul>
            <li>
              <a href="/pet" class=""
                ><span
                  class="block px-4 py-2 bg-gray-300 text-gray-900 hover:bg-gray-400"
                  >Petstore</span
                ></a
              >
            </li>
          </ul>
        </nav>
        <div class="w-full px-6 py-8 md:w-2/3 lg:w-3/4 xl:w-4/5 mt-16">
          <div data-testid="page-not-found-mock"></div>
        </div>
      </div>
    </div>
    "
  `);
  });

  test('pet list', async () => {
    const router = createRouter({
      history: createWebHistory(),
      routes,
    });

    const { container } = render(<App />, {
      global: {
        plugins: [router],
      },
    });

    await router.push('/pet');

    expect(formatHtml(container.outerHTML)).toMatchInlineSnapshot(`
    "<div>
      <div class="relative flex min-h-full flex-col md:flex-row">
        <nav
          class="absolute flow-root h-16 w-full bg-gray-900 px-4 py-3 text-2xl leading-relaxed font-semibold text-gray-100 uppercase"
        >
          <button
            class="float-right block border-2 p-2 md:hidden"
            data-testid="navigation-toggle"
          >
            <span class="block h-2 w-6 border-t-2"></span
            ><span class="block h-2 w-6 border-t-2"></span
            ><span class="block h-0 w-6 border-t-2"></span></button
          ><a href="/" class="hover:text-gray-500">Petstore</a>
        </nav>
        <nav
          class="mt-16 w-full bg-gray-200 md:block md:w-1/3 lg:w-1/4 xl:w-1/5 hidden"
        >
          <ul>
            <li>
              <a
                href="/pet"
                class="router-link-active router-link-exact-active"
                aria-current="page"
                ><span
                  class="block px-4 py-2 bg-gray-700 text-gray-100 hover:bg-gray-600"
                  >Petstore</span
                ></a
              >
            </li>
          </ul>
        </nav>
        <div class="w-full px-6 py-8 md:w-2/3 lg:w-3/4 xl:w-4/5 mt-16">
          <div data-testid="page-pet-list-mock"></div>
        </div>
      </div>
    </div>
    "
  `);
  });

  test('pet create', async () => {
    const router = createRouter({
      history: createWebHistory(),
      routes,
    });

    const { container } = render(<App />, {
      global: {
        plugins: [router],
      },
    });

    await router.push('/pet/create');

    expect(formatHtml(container.outerHTML)).toMatchInlineSnapshot(`
    "<div>
      <div class="relative flex min-h-full flex-col md:flex-row">
        <nav
          class="absolute flow-root h-16 w-full bg-gray-900 px-4 py-3 text-2xl leading-relaxed font-semibold text-gray-100 uppercase"
        >
          <button
            class="float-right block border-2 p-2 md:hidden"
            data-testid="navigation-toggle"
          >
            <span class="block h-2 w-6 border-t-2"></span
            ><span class="block h-2 w-6 border-t-2"></span
            ><span class="block h-0 w-6 border-t-2"></span></button
          ><a href="/" class="hover:text-gray-500">Petstore</a>
        </nav>
        <nav
          class="mt-16 w-full bg-gray-200 md:block md:w-1/3 lg:w-1/4 xl:w-1/5 hidden"
        >
          <ul>
            <li>
              <a href="/pet" class="router-link-active"
                ><span
                  class="block px-4 py-2 bg-gray-700 text-gray-100 hover:bg-gray-600"
                  >Petstore</span
                ></a
              >
            </li>
          </ul>
        </nav>
        <div class="w-full px-6 py-8 md:w-2/3 lg:w-3/4 xl:w-4/5 mt-16">
          <div data-testid="page-pet-create-mock"></div>
        </div>
      </div>
    </div>
    "
  `);
  });

  test('pet read', async () => {
    const router = createRouter({
      history: createWebHistory(),
      routes,
    });

    const { container } = render(<App />, {
      global: {
        plugins: [router],
      },
    });

    await router.push('/pet/4d783b77-eb09-4603-b99b-f590b605eaa9');

    expect(formatHtml(container.outerHTML)).toMatchInlineSnapshot(`
    "<div>
      <div class="relative flex min-h-full flex-col md:flex-row">
        <nav
          class="absolute flow-root h-16 w-full bg-gray-900 px-4 py-3 text-2xl leading-relaxed font-semibold text-gray-100 uppercase"
        >
          <button
            class="float-right block border-2 p-2 md:hidden"
            data-testid="navigation-toggle"
          >
            <span class="block h-2 w-6 border-t-2"></span
            ><span class="block h-2 w-6 border-t-2"></span
            ><span class="block h-0 w-6 border-t-2"></span></button
          ><a href="/" class="hover:text-gray-500">Petstore</a>
        </nav>
        <nav
          class="mt-16 w-full bg-gray-200 md:block md:w-1/3 lg:w-1/4 xl:w-1/5 hidden"
        >
          <ul>
            <li>
              <a href="/pet" class="router-link-active"
                ><span
                  class="block px-4 py-2 bg-gray-700 text-gray-100 hover:bg-gray-600"
                  >Petstore</span
                ></a
              >
            </li>
          </ul>
        </nav>
        <div class="w-full px-6 py-8 md:w-2/3 lg:w-3/4 xl:w-4/5 mt-16">
          <div data-testid="page-pet-read-mock"></div>
        </div>
      </div>
    </div>
    "
  `);
  });

  test('pet update', async () => {
    const router = createRouter({
      history: createWebHistory(),
      routes,
    });

    const { container } = render(<App />, {
      global: {
        plugins: [router],
      },
    });

    await router.push('/pet/4d783b77-eb09-4603-b99b-f590b605eaa9/update');

    expect(formatHtml(container.outerHTML)).toMatchInlineSnapshot(`
    "<div>
      <div class="relative flex min-h-full flex-col md:flex-row">
        <nav
          class="absolute flow-root h-16 w-full bg-gray-900 px-4 py-3 text-2xl leading-relaxed font-semibold text-gray-100 uppercase"
        >
          <button
            class="float-right block border-2 p-2 md:hidden"
            data-testid="navigation-toggle"
          >
            <span class="block h-2 w-6 border-t-2"></span
            ><span class="block h-2 w-6 border-t-2"></span
            ><span class="block h-0 w-6 border-t-2"></span></button
          ><a href="/" class="hover:text-gray-500">Petstore</a>
        </nav>
        <nav
          class="mt-16 w-full bg-gray-200 md:block md:w-1/3 lg:w-1/4 xl:w-1/5 hidden"
        >
          <ul>
            <li>
              <a href="/pet" class="router-link-active"
                ><span
                  class="block px-4 py-2 bg-gray-700 text-gray-100 hover:bg-gray-600"
                  >Petstore</span
                ></a
              >
            </li>
          </ul>
        </nav>
        <div class="w-full px-6 py-8 md:w-2/3 lg:w-3/4 xl:w-4/5 mt-16">
          <div data-testid="page-pet-update-mock"></div>
        </div>
      </div>
    </div>
    "
  `);
  });
});
