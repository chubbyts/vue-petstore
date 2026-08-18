/** @jsxImportSource vue */

import { test, expect, vi, describe, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/vue';
import { userEvent } from '@testing-library/user-event';
import { createRouter, createWebHistory } from 'vue-router';
import { defineComponent } from 'vue';
import { routes } from '../src/routes';
import App from '../src/app';
import type { Oidc } from '../src/hook/use-oidc';
import { formatHtml } from './formatter';

const { oidc } = vi.hoisted(() => {
  return {
    oidc: {
      isLoading: false,
      isAuthenticated: true,
      error: undefined,
      login: vi.fn(),
      logout: vi.fn(),
    } as Oidc,
  };
});

vi.mock('../src/hook/use-oidc', () => {
  return {
    useOidc: () => oidc,
  };
});

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
  beforeEach(() => {
    // oxlint-disable functional/immutable-data
    oidc.isLoading = false;
    oidc.isAuthenticated = true;
    oidc.error = undefined;
    oidc.login = vi.fn();
    oidc.logout = vi.fn();
    // oxlint-enable functional/immutable-data
  });

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
              type="button"
              class="float-right ml-4 block border-2 p-2 md:hidden"
              data-testid="navigation-toggle"
            >
              <span class="block h-2 w-6 border-t-2"></span
              ><span class="block h-2 w-6 border-t-2"></span
              ><span class="block h-0 w-6 border-t-2"></span></button
            ><button
              type="button"
              data-testid="navigation-logout"
              class="float-right ml-4 border-2 px-3 py-1 text-base leading-relaxed hover:bg-gray-700"
            >
              Logout</button
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
            <!----><!---->
          </div>
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
              type="button"
              class="float-right ml-4 block border-2 p-2 md:hidden"
              data-testid="navigation-toggle"
            >
              <span class="block h-2 w-6 border-t-2"></span
              ><span class="block h-2 w-6 border-t-2"></span
              ><span class="block h-0 w-6 border-t-2"></span></button
            ><button
              type="button"
              data-testid="navigation-logout"
              class="float-right ml-4 border-2 px-3 py-1 text-base leading-relaxed hover:bg-gray-700"
            >
              Logout</button
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
            <!---->
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

    // oxlint-disable-next-line functional/immutable-data
    await router.push('/unknown');

    expect(formatHtml(container.outerHTML)).toMatchInlineSnapshot(`
      "<div>
        <div class="relative flex min-h-full flex-col md:flex-row">
          <nav
            class="absolute flow-root h-16 w-full bg-gray-900 px-4 py-3 text-2xl leading-relaxed font-semibold text-gray-100 uppercase"
          >
            <button
              type="button"
              class="float-right ml-4 block border-2 p-2 md:hidden"
              data-testid="navigation-toggle"
            >
              <span class="block h-2 w-6 border-t-2"></span
              ><span class="block h-2 w-6 border-t-2"></span
              ><span class="block h-0 w-6 border-t-2"></span></button
            ><button
              type="button"
              data-testid="navigation-logout"
              class="float-right ml-4 border-2 px-3 py-1 text-base leading-relaxed hover:bg-gray-700"
            >
              Logout</button
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
            <!---->
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

    // oxlint-disable-next-line functional/immutable-data
    await router.push('/pet');

    expect(formatHtml(container.outerHTML)).toMatchInlineSnapshot(`
      "<div>
        <div class="relative flex min-h-full flex-col md:flex-row">
          <nav
            class="absolute flow-root h-16 w-full bg-gray-900 px-4 py-3 text-2xl leading-relaxed font-semibold text-gray-100 uppercase"
          >
            <button
              type="button"
              class="float-right ml-4 block border-2 p-2 md:hidden"
              data-testid="navigation-toggle"
            >
              <span class="block h-2 w-6 border-t-2"></span
              ><span class="block h-2 w-6 border-t-2"></span
              ><span class="block h-0 w-6 border-t-2"></span></button
            ><button
              type="button"
              data-testid="navigation-logout"
              class="float-right ml-4 border-2 px-3 py-1 text-base leading-relaxed hover:bg-gray-700"
            >
              Logout</button
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
            <!---->
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

    // oxlint-disable-next-line functional/immutable-data
    await router.push('/pet/create');

    expect(formatHtml(container.outerHTML)).toMatchInlineSnapshot(`
      "<div>
        <div class="relative flex min-h-full flex-col md:flex-row">
          <nav
            class="absolute flow-root h-16 w-full bg-gray-900 px-4 py-3 text-2xl leading-relaxed font-semibold text-gray-100 uppercase"
          >
            <button
              type="button"
              class="float-right ml-4 block border-2 p-2 md:hidden"
              data-testid="navigation-toggle"
            >
              <span class="block h-2 w-6 border-t-2"></span
              ><span class="block h-2 w-6 border-t-2"></span
              ><span class="block h-0 w-6 border-t-2"></span></button
            ><button
              type="button"
              data-testid="navigation-logout"
              class="float-right ml-4 border-2 px-3 py-1 text-base leading-relaxed hover:bg-gray-700"
            >
              Logout</button
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
            <!---->
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

    // oxlint-disable-next-line functional/immutable-data
    await router.push('/pet/4d783b77-eb09-4603-b99b-f590b605eaa9');

    expect(formatHtml(container.outerHTML)).toMatchInlineSnapshot(`
      "<div>
        <div class="relative flex min-h-full flex-col md:flex-row">
          <nav
            class="absolute flow-root h-16 w-full bg-gray-900 px-4 py-3 text-2xl leading-relaxed font-semibold text-gray-100 uppercase"
          >
            <button
              type="button"
              class="float-right ml-4 block border-2 p-2 md:hidden"
              data-testid="navigation-toggle"
            >
              <span class="block h-2 w-6 border-t-2"></span
              ><span class="block h-2 w-6 border-t-2"></span
              ><span class="block h-0 w-6 border-t-2"></span></button
            ><button
              type="button"
              data-testid="navigation-logout"
              class="float-right ml-4 border-2 px-3 py-1 text-base leading-relaxed hover:bg-gray-700"
            >
              Logout</button
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
            <!---->
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

    // oxlint-disable-next-line functional/immutable-data
    await router.push('/pet/4d783b77-eb09-4603-b99b-f590b605eaa9/update');

    expect(formatHtml(container.outerHTML)).toMatchInlineSnapshot(`
      "<div>
        <div class="relative flex min-h-full flex-col md:flex-row">
          <nav
            class="absolute flow-root h-16 w-full bg-gray-900 px-4 py-3 text-2xl leading-relaxed font-semibold text-gray-100 uppercase"
          >
            <button
              type="button"
              class="float-right ml-4 block border-2 p-2 md:hidden"
              data-testid="navigation-toggle"
            >
              <span class="block h-2 w-6 border-t-2"></span
              ><span class="block h-2 w-6 border-t-2"></span
              ><span class="block h-0 w-6 border-t-2"></span></button
            ><button
              type="button"
              data-testid="navigation-logout"
              class="float-right ml-4 border-2 px-3 py-1 text-base leading-relaxed hover:bg-gray-700"
            >
              Logout</button
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
            <!---->
            <div data-testid="page-pet-update-mock"></div>
          </div>
        </div>
      </div>
      "
    `);
  });

  test('loading', async () => {
    // oxlint-disable-next-line functional/immutable-data
    oidc.isLoading = true;

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
              type="button"
              class="float-right ml-4 block border-2 p-2 md:hidden"
              data-testid="navigation-toggle"
            >
              <span class="block h-2 w-6 border-t-2"></span
              ><span class="block h-2 w-6 border-t-2"></span
              ><span class="block h-0 w-6 border-t-2"></span></button
            ><button
              type="button"
              data-testid="navigation-logout"
              class="float-right ml-4 border-2 px-3 py-1 text-base leading-relaxed hover:bg-gray-700"
            >
              Logout</button
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
            <!----><!---->
          </div>
        </div>
      </div>
      "
    `);
  });

  test('login', async () => {
    // oxlint-disable-next-line functional/immutable-data
    oidc.isAuthenticated = false;

    const router = createRouter({
      history: createWebHistory(),
      routes,
    });

    const { container } = render(<App />, {
      global: {
        plugins: [router],
      },
    });

    const login = await screen.findByTestId('login');

    expect(formatHtml(container.outerHTML)).toMatchInlineSnapshot(`
      "<div>
        <div class="relative flex min-h-full flex-col md:flex-row">
          <nav
            class="absolute flow-root h-16 w-full bg-gray-900 px-4 py-3 text-2xl leading-relaxed font-semibold text-gray-100 uppercase"
          >
            <button
              type="button"
              class="float-right ml-4 block border-2 p-2 md:hidden"
              data-testid="navigation-toggle"
            >
              <span class="block h-2 w-6 border-t-2"></span
              ><span class="block h-2 w-6 border-t-2"></span
              ><span class="block h-0 w-6 border-t-2"></span></button
            ><!----><a href="/" class="hover:text-gray-500">Petstore</a>
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
            <!---->
            <div data-testid="login-required">
              <h1 class="mb-4 border-b border-gray-200 pb-2 text-4xl font-black">
                Login
              </h1>
              <p class="mb-4">You need to login to use the petstore.</p>
              <button
                type="submit"
                colortheme="blue"
                class="inline-block px-5 py-2 text-white bg-blue-600 hover:bg-blue-700"
                data-testid="login"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
      "
    `);

    await userEvent.click(login);

    expect(oidc.login).toHaveBeenCalledTimes(1);
    expect(oidc.logout).toHaveBeenCalledTimes(0);
  });

  test('logout', async () => {
    const router = createRouter({
      history: createWebHistory(),
      routes,
    });

    render(<App />, {
      global: {
        plugins: [router],
      },
    });

    const navigationLogout = await screen.findByTestId('navigation-logout');

    await userEvent.click(navigationLogout);

    expect(oidc.login).toHaveBeenCalledTimes(0);
    expect(oidc.logout).toHaveBeenCalledTimes(1);
  });

  test('authentication error', async () => {
    // oxlint-disable functional/immutable-data
    oidc.isAuthenticated = false;
    oidc.error = new Error('invalid_grant');
    // oxlint-enable functional/immutable-data

    const router = createRouter({
      history: createWebHistory(),
      routes,
    });

    const { container } = render(<App />, {
      global: {
        plugins: [router],
      },
    });

    await screen.findByTestId('http-error');

    expect(formatHtml(container.outerHTML)).toMatchInlineSnapshot(`
      "<div>
        <div class="relative flex min-h-full flex-col md:flex-row">
          <nav
            class="absolute flow-root h-16 w-full bg-gray-900 px-4 py-3 text-2xl leading-relaxed font-semibold text-gray-100 uppercase"
          >
            <button
              type="button"
              class="float-right ml-4 block border-2 p-2 md:hidden"
              data-testid="navigation-toggle"
            >
              <span class="block h-2 w-6 border-t-2"></span
              ><span class="block h-2 w-6 border-t-2"></span
              ><span class="block h-0 w-6 border-t-2"></span></button
            ><!----><a href="/" class="hover:text-gray-500">Petstore</a>
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
            <div data-testid="http-error" class="mb-6 bg-red-300 px-5 py-4">
              <p class="font-bold">Authentication failed</p>
              <p>invalid_grant</p>
              <!----><!---->
            </div>
            <div data-testid="login-required">
              <h1 class="mb-4 border-b border-gray-200 pb-2 text-4xl font-black">
                Login
              </h1>
              <p class="mb-4">You need to login to use the petstore.</p>
              <button
                type="submit"
                colortheme="blue"
                class="inline-block px-5 py-2 text-white bg-blue-600 hover:bg-blue-700"
                data-testid="login"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
      "
    `);
  });
});
