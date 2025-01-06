/** @jsxImportSource vue */

import { vi, test, expect } from 'vitest';
import { userEvent } from '@testing-library/user-event';
import { render, screen } from '@testing-library/vue';
import { createRouter, createWebHistory, RouterView } from 'vue-router';
import { defineComponent } from 'vue';
import type { PetFilters, PetListRequest, PetListResponse } from '../../../../src/model/pet';
import { formatHtml } from '../../../formatter';
import type { deletePetClient, listPetsClient } from '../../../../src/client/pet';
import type { HttpError } from '../../../../src/client/error';
import { BadRequest, NetworkError } from '../../../../src/client/error';

// eslint-disable-next-line functional/no-let
let mockDeletePetClient: typeof deletePetClient;
// eslint-disable-next-line functional/no-let
let mockListPetsClient: typeof listPetsClient;

vi.mock('../../../../src/client/pet', () => {
  return {
    // eslint-disable-next-line functional/prefer-tacit
    deletePetClient: (id: string) => {
      return mockDeletePetClient(id);
    },
    // eslint-disable-next-line functional/prefer-tacit
    listPetsClient: (petListRequest: PetListRequest) => {
      return mockListPetsClient(petListRequest);
    },
  };
});

vi.mock('../../../../src/component/form/pet-filters-form', () => {
  return {
    __esModule: true,
    PetFiltersForm: defineComponent(
      (props: {
        httpError: HttpError | undefined;
        initialPetFilters: PetFilters;
        submitPetFilters: (petFilters: PetFilters) => void;
      }) => {
        const onClick = () => {
          props.submitPetFilters({ name: 'Brownie' });
        };

        return () => (
          <button
            data-testid="pet-filters-form-submit"
            data-has-http-error={!!props.httpError}
            data-has-initial-pet-filters={!!props.initialPetFilters}
            onClick={onClick}
          />
        );
      },
      { props: ['httpError', 'initialPetFilters', 'submitPetFilters'] },
    ),
  };
});

vi.mock('../../../../src/component/partial/pagination', () => {
  return {
    __esModule: true,
    Pagination: defineComponent(
      (props: { currentPage: number; totalPages: number; maxPages: number; submitPage: (page: number) => void }) => {
        const onClick = () => {
          props.submitPage(2);
        };

        return () => (
          <button
            data-testid="pagination-next"
            data-current-page={props.currentPage}
            data-total-pages={props.totalPages}
            data-max-pages={props.maxPages}
            onClick={onClick}
          />
        );
      },
      { props: ['currentPage', 'totalPages', 'maxPages', 'submitPage'] },
    ),
  };
});

test('default minimal', async () => {
  mockListPetsClient = async (petListRequest: PetListRequest) => {
    expect(petListRequest).toEqual({
      offset: 0,
      limit: 10,
      filters: {},
      sort: {},
    });

    return {
      offset: 0,
      limit: 10,
      filters: {},
      sort: {},
      count: 1,
      items: [
        {
          id: '4d783b77-eb09-4603-b99b-f590b605eaa9',
          createdAt: '2005-08-15T15:52:01+00:00',
          updatedAt: '2005-08-15T15:55:01+00:00',
          name: 'Brownie',
          vaccinations: [],
          _links: {},
        },
      ],
      _links: {},
    };
  };

  mockDeletePetClient = async () => undefined;

  const router = createRouter({
    history: createWebHistory(),
    routes: [
      { path: '/', name: 'Home', component: defineComponent(() => () => <div data-testid="page-home-mock" />) },
      { path: '/pet', name: 'PetList', component: () => import('../../../../src/component/page/pet/list') },
      {
        path: '/pet/create',
        name: 'PetCreate',
        component: defineComponent(() => () => <div data-testid="page-pet-create-mock" />),
      },
      {
        path: '/pet/4d783b77-eb09-4603-b99b-f590b605eaa9',
        name: 'PetRead',
        component: defineComponent(() => () => <div data-testid="page-pet-read-mock" />),
      },
      {
        path: '/pet/4d783b77-eb09-4603-b99b-f590b605eaa9/update',
        name: 'PetUpdate',
        component: defineComponent(() => () => <div data-testid="page-pet-update-mock" />),
      },
    ],
  });

  const { container } = render(<RouterView />, {
    global: {
      plugins: [router],
    },
  });

  await router.push('/pet');

  await screen.findByTestId('page-pet-list');

  expect(formatHtml(container.outerHTML)).toMatchInlineSnapshot(`
    "<div>
      <div data-testid="page-pet-list">
        <!---->
        <h1 class="mb-4 border-b pb-2 text-4xl font-black">Pet List</h1>
        <div>
          <!----><button
            data-testid="pet-filters-form-submit"
            data-has-http-error="false"
            data-has-initial-pet-filters="true"
          ></button>
          <div class="mt-4">
            <div class="block w-full md:table">
              <div class="block w-full md:table-header-group">
                <div class="mb-5 block even:bg-gray-100 md:mt-0 md:table-row">
                  <div
                    class="block border-x border-gray-300 bg-gray-100 px-4 font-bold first:border-t first:pt-3 last:border-b last:pb-3 md:table-cell md:border-x-0 md:border-y md:px-4 md:py-3 md:first:border-l md:last:border-r"
                  >
                    Id
                  </div>
                  <div
                    class="block border-x border-gray-300 bg-gray-100 px-4 font-bold first:border-t first:pt-3 last:border-b last:pb-3 md:table-cell md:border-x-0 md:border-y md:px-4 md:py-3 md:first:border-l md:last:border-r"
                  >
                    CreatedAt
                  </div>
                  <div
                    class="block border-x border-gray-300 bg-gray-100 px-4 font-bold first:border-t first:pt-3 last:border-b last:pb-3 md:table-cell md:border-x-0 md:border-y md:px-4 md:py-3 md:first:border-l md:last:border-r"
                  >
                    UpdatedAt
                  </div>
                  <div
                    class="block border-x border-gray-300 bg-gray-100 px-4 font-bold first:border-t first:pt-3 last:border-b last:pb-3 md:table-cell md:border-x-0 md:border-y md:px-4 md:py-3 md:first:border-l md:last:border-r"
                  >
                    <span>Name (</span
                    ><button data-testid="pet-sort-name-asc">
                      <span class="mx-1 inline-block">A-Z</span></button
                    ><span>|</span
                    ><button data-testid="pet-sort-name-desc">
                      <span class="mx-1 inline-block">Z-A</span></button
                    ><span>|</span
                    ><button data-testid="pet-sort-name--">
                      <span class="mx-1 inline-block">---</span></button
                    ><span>)</span>
                  </div>
                  <div
                    class="block border-x border-gray-300 bg-gray-100 px-4 font-bold first:border-t first:pt-3 last:border-b last:pb-3 md:table-cell md:border-x-0 md:border-y md:px-4 md:py-3 md:first:border-l md:last:border-r"
                  >
                    Tag
                  </div>
                  <div
                    class="block border-x border-gray-300 bg-gray-100 px-4 font-bold first:border-t first:pt-3 last:border-b last:pb-3 md:table-cell md:border-x-0 md:border-y md:px-4 md:py-3 md:first:border-l md:last:border-r"
                  >
                    Actions
                  </div>
                </div>
              </div>
              <div class="block w-full md:table-row-group">
                <div class="mb-5 block even:bg-gray-100 md:mt-0 md:table-row">
                  <div
                    class="block border-x border-gray-300 px-4 first:border-t first:pt-3 last:border-b last:pb-3 md:table-cell md:border-x-0 md:border-b md:px-4 md:py-3 md:first:border-l md:first:border-t-0 md:last:border-r"
                  >
                    4d783b77-eb09-4603-b99b-f590b605eaa9
                  </div>
                  <div
                    class="block border-x border-gray-300 px-4 first:border-t first:pt-3 last:border-b last:pb-3 md:table-cell md:border-x-0 md:border-b md:px-4 md:py-3 md:first:border-l md:first:border-t-0 md:last:border-r"
                  >
                    15.08.2005 - 17:52:01
                  </div>
                  <div
                    class="block border-x border-gray-300 px-4 first:border-t first:pt-3 last:border-b last:pb-3 md:table-cell md:border-x-0 md:border-b md:px-4 md:py-3 md:first:border-l md:first:border-t-0 md:last:border-r"
                  >
                    15.08.2005 - 17:55:01
                  </div>
                  <div
                    class="block border-x border-gray-300 px-4 first:border-t first:pt-3 last:border-b last:pb-3 md:table-cell md:border-x-0 md:border-b md:px-4 md:py-3 md:first:border-l md:first:border-t-0 md:last:border-r"
                  >
                    Brownie
                  </div>
                  <div
                    class="block border-x border-gray-300 px-4 first:border-t first:pt-3 last:border-b last:pb-3 md:table-cell md:border-x-0 md:border-b md:px-4 md:py-3 md:first:border-l md:first:border-t-0 md:last:border-r"
                  >
                    <!---->
                  </div>
                  <div
                    class="block border-x border-gray-300 px-4 first:border-t first:pt-3 last:border-b last:pb-3 md:table-cell md:border-x-0 md:border-b md:px-4 md:py-3 md:first:border-l md:first:border-t-0 md:last:border-r"
                  >
                    <!----><!----><!---->
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="mt-4">
            <button
              data-testid="pagination-next"
              data-current-page="1"
              data-total-pages="1"
              data-max-pages="7"
            ></button>
          </div>
        </div>
      </div>
    </div>
    "
  `);
});

test('bad request', async () => {
  mockListPetsClient = async (petListRequest: PetListRequest) => {
    expect(petListRequest).toEqual({
      offset: 0,
      limit: 10,
      filters: {},
      sort: {},
    });

    return new Promise<BadRequest>((resolve) => resolve(new BadRequest({ title: 'bad request' })));
  };

  mockDeletePetClient = async () => undefined;

  const router = createRouter({
    history: createWebHistory(),
    routes: [
      { path: '/', name: 'Home', component: defineComponent(() => () => <div data-testid="page-home-mock" />) },
      { path: '/pet', name: 'PetList', component: () => import('../../../../src/component/page/pet/list') },
    ],
  });

  const { container } = render(<RouterView />, {
    global: {
      plugins: [router],
    },
  });

  await router.push('/pet');

  await screen.findByTestId('page-pet-list');

  expect(formatHtml(container.outerHTML)).toMatchInlineSnapshot(`
    "<div>
      <div data-testid="page-pet-list">
        <div data-testid="http-error" class="mb-6 bg-red-300 px-5 py-4">
          <p class="font-bold">bad request</p>
          <!----><!----><!---->
        </div>
        <h1 class="mb-4 border-b pb-2 text-4xl font-black">Pet List</h1>
        <!---->
      </div>
    </div>
    "
  `);
});

test('default maximal', async () => {
  mockListPetsClient = async (petListRequest: PetListRequest) => {
    expect(petListRequest).toEqual({
      offset: 0,
      limit: 10,
      filters: {},
      sort: {},
    });

    return {
      offset: 0,
      limit: 10,
      filters: {},
      sort: {},
      count: 1,
      items: [
        {
          id: '4d783b77-eb09-4603-b99b-f590b605eaa9',
          createdAt: '2005-08-15T15:52:01+00:00',
          updatedAt: '2005-08-15T15:55:01+00:00',
          name: 'Brownie',
          tag: '0001-000',
          vaccinations: [{ name: 'Rabies' }],
          _links: {
            read: { href: '/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9' },
            update: { href: '/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9' },
            delete: { href: '/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9' },
          },
        },
      ],
      _links: {
        create: { href: '/api/pets' },
      },
    };
  };

  mockDeletePetClient = async () => undefined;

  const router = createRouter({
    history: createWebHistory(),
    routes: [
      { path: '/', name: 'Home', component: defineComponent(() => () => <div data-testid="page-home-mock" />) },
      { path: '/pet', name: 'PetList', component: () => import('../../../../src/component/page/pet/list') },
      {
        path: '/pet/create',
        name: 'PetCreate',
        component: defineComponent(() => () => <div data-testid="page-pet-create-mock" />),
      },
      {
        path: '/pet/4d783b77-eb09-4603-b99b-f590b605eaa9',
        name: 'PetRead',
        component: defineComponent(() => () => <div data-testid="page-pet-read-mock" />),
      },
      {
        path: '/pet/4d783b77-eb09-4603-b99b-f590b605eaa9/update',
        name: 'PetUpdate',
        component: defineComponent(() => () => <div data-testid="page-pet-update-mock" />),
      },
    ],
  });

  const { container } = render(<RouterView />, {
    global: {
      plugins: [router],
    },
  });

  await router.push('/pet');

  await screen.findByTestId('page-pet-list');

  expect(formatHtml(container.outerHTML)).toMatchInlineSnapshot(`
    "<div>
      <div data-testid="page-pet-list">
        <!---->
        <h1 class="mb-4 border-b pb-2 text-4xl font-black">Pet List</h1>
        <div>
          <a
            href="/pet/create"
            class="mb-4 inline-block px-5 py-2 text-white bg-green-600 hover:bg-green-700 mb-4"
            colortheme="green"
            >Create</a
          ><button
            data-testid="pet-filters-form-submit"
            data-has-http-error="false"
            data-has-initial-pet-filters="true"
          ></button>
          <div class="mt-4">
            <div class="block w-full md:table">
              <div class="block w-full md:table-header-group">
                <div class="mb-5 block even:bg-gray-100 md:mt-0 md:table-row">
                  <div
                    class="block border-x border-gray-300 bg-gray-100 px-4 font-bold first:border-t first:pt-3 last:border-b last:pb-3 md:table-cell md:border-x-0 md:border-y md:px-4 md:py-3 md:first:border-l md:last:border-r"
                  >
                    Id
                  </div>
                  <div
                    class="block border-x border-gray-300 bg-gray-100 px-4 font-bold first:border-t first:pt-3 last:border-b last:pb-3 md:table-cell md:border-x-0 md:border-y md:px-4 md:py-3 md:first:border-l md:last:border-r"
                  >
                    CreatedAt
                  </div>
                  <div
                    class="block border-x border-gray-300 bg-gray-100 px-4 font-bold first:border-t first:pt-3 last:border-b last:pb-3 md:table-cell md:border-x-0 md:border-y md:px-4 md:py-3 md:first:border-l md:last:border-r"
                  >
                    UpdatedAt
                  </div>
                  <div
                    class="block border-x border-gray-300 bg-gray-100 px-4 font-bold first:border-t first:pt-3 last:border-b last:pb-3 md:table-cell md:border-x-0 md:border-y md:px-4 md:py-3 md:first:border-l md:last:border-r"
                  >
                    <span>Name (</span
                    ><button data-testid="pet-sort-name-asc">
                      <span class="mx-1 inline-block">A-Z</span></button
                    ><span>|</span
                    ><button data-testid="pet-sort-name-desc">
                      <span class="mx-1 inline-block">Z-A</span></button
                    ><span>|</span
                    ><button data-testid="pet-sort-name--">
                      <span class="mx-1 inline-block">---</span></button
                    ><span>)</span>
                  </div>
                  <div
                    class="block border-x border-gray-300 bg-gray-100 px-4 font-bold first:border-t first:pt-3 last:border-b last:pb-3 md:table-cell md:border-x-0 md:border-y md:px-4 md:py-3 md:first:border-l md:last:border-r"
                  >
                    Tag
                  </div>
                  <div
                    class="block border-x border-gray-300 bg-gray-100 px-4 font-bold first:border-t first:pt-3 last:border-b last:pb-3 md:table-cell md:border-x-0 md:border-y md:px-4 md:py-3 md:first:border-l md:last:border-r"
                  >
                    Actions
                  </div>
                </div>
              </div>
              <div class="block w-full md:table-row-group">
                <div class="mb-5 block even:bg-gray-100 md:mt-0 md:table-row">
                  <div
                    class="block border-x border-gray-300 px-4 first:border-t first:pt-3 last:border-b last:pb-3 md:table-cell md:border-x-0 md:border-b md:px-4 md:py-3 md:first:border-l md:first:border-t-0 md:last:border-r"
                  >
                    4d783b77-eb09-4603-b99b-f590b605eaa9
                  </div>
                  <div
                    class="block border-x border-gray-300 px-4 first:border-t first:pt-3 last:border-b last:pb-3 md:table-cell md:border-x-0 md:border-b md:px-4 md:py-3 md:first:border-l md:first:border-t-0 md:last:border-r"
                  >
                    15.08.2005 - 17:52:01
                  </div>
                  <div
                    class="block border-x border-gray-300 px-4 first:border-t first:pt-3 last:border-b last:pb-3 md:table-cell md:border-x-0 md:border-b md:px-4 md:py-3 md:first:border-l md:first:border-t-0 md:last:border-r"
                  >
                    15.08.2005 - 17:55:01
                  </div>
                  <div
                    class="block border-x border-gray-300 px-4 first:border-t first:pt-3 last:border-b last:pb-3 md:table-cell md:border-x-0 md:border-b md:px-4 md:py-3 md:first:border-l md:first:border-t-0 md:last:border-r"
                  >
                    Brownie
                  </div>
                  <div
                    class="block border-x border-gray-300 px-4 first:border-t first:pt-3 last:border-b last:pb-3 md:table-cell md:border-x-0 md:border-b md:px-4 md:py-3 md:first:border-l md:first:border-t-0 md:last:border-r"
                  >
                    0001-000
                  </div>
                  <div
                    class="block border-x border-gray-300 px-4 first:border-t first:pt-3 last:border-b last:pb-3 md:table-cell md:border-x-0 md:border-b md:px-4 md:py-3 md:first:border-l md:first:border-t-0 md:last:border-r"
                  >
                    <a
                      href="/pet/4d783b77-eb09-4603-b99b-f590b605eaa9"
                      class="mr-4 inline-block px-5 py-2 text-white bg-gray-600 hover:bg-gray-700 mr-4"
                      colortheme="gray"
                      >Read</a
                    ><a
                      href="/pet/4d783b77-eb09-4603-b99b-f590b605eaa9/update"
                      class="mr-4 inline-block px-5 py-2 text-white bg-gray-600 hover:bg-gray-700 mr-4"
                      colortheme="gray"
                      >Update</a
                    ><button
                      colortheme="red"
                      class="inline-block px-5 py-2 text-white bg-red-600 hover:bg-red-700"
                      data-testid="remove-pet-0"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="mt-4">
            <button
              data-testid="pagination-next"
              data-current-page="1"
              data-total-pages="1"
              data-max-pages="7"
            ></button>
          </div>
        </div>
      </div>
    </div>
    "
  `);
});

test('delete error', async () => {
  mockListPetsClient = async (petListRequest: PetListRequest) => {
    expect(petListRequest).toEqual({
      offset: 0,
      limit: 10,
      filters: {},
      sort: {},
    });

    return {
      offset: 0,
      limit: 10,
      filters: {},
      sort: {},
      count: 1,
      items: [
        {
          id: '4d783b77-eb09-4603-b99b-f590b605eaa9',
          createdAt: '2005-08-15T15:52:01+00:00',
          updatedAt: '2005-08-15T15:55:01+00:00',
          name: 'Brownie',
          tag: '0001-000',
          vaccinations: [{ name: 'Rabies' }],
          _links: {
            read: { href: '/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9' },
            update: { href: '/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9' },
            delete: { href: '/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9' },
          },
        },
      ],
      _links: {
        create: { href: '/api/pets' },
      },
    };
  };

  mockDeletePetClient = async (id: string) => {
    expect(id).toBe('4d783b77-eb09-4603-b99b-f590b605eaa9');

    return new NetworkError({ title: 'network error' });
  };

  const router = createRouter({
    history: createWebHistory(),
    routes: [
      { path: '/', name: 'Home', component: defineComponent(() => () => <div data-testid="page-home-mock" />) },
      { path: '/pet', name: 'PetList', component: () => import('../../../../src/component/page/pet/list') },
      {
        path: '/pet/create',
        name: 'PetCreate',
        component: defineComponent(() => () => <div data-testid="page-pet-create-mock" />),
      },
      {
        path: '/pet/4d783b77-eb09-4603-b99b-f590b605eaa9',
        name: 'PetRead',
        component: defineComponent(() => () => <div data-testid="page-pet-read-mock" />),
      },
      {
        path: '/pet/4d783b77-eb09-4603-b99b-f590b605eaa9/update',
        name: 'PetUpdate',
        component: defineComponent(() => () => <div data-testid="page-pet-update-mock" />),
      },
    ],
  });

  render(<RouterView />, {
    global: {
      plugins: [router],
    },
  });

  await router.push('/pet');

  await screen.findByTestId('page-pet-list');

  const removeButton = await screen.findByTestId('remove-pet-0');

  await userEvent.click(removeButton);

  await screen.findByTestId('http-error');

  expect(formatHtml((await screen.findByTestId('http-error')).outerHTML)).toMatchInlineSnapshot(`
    "<div data-testid="http-error" class="mb-6 bg-red-300 px-5 py-4">
      <p class="font-bold">network error</p>
      <!----><!----><!---->
    </div>
    "
  `);
});

test('delete success', async () => {
  const petListCalls: Array<{ parameters: [PetListRequest]; return: Promise<PetListResponse> }> = [
    {
      parameters: [
        {
          offset: 0,
          limit: 10,
          filters: {},
          sort: {},
        },
      ],
      return: Promise.resolve({
        offset: 0,
        limit: 10,
        filters: {},
        sort: {},
        count: 1,
        items: [
          {
            id: '4d783b77-eb09-4603-b99b-f590b605eaa9',
            createdAt: '2005-08-15T15:52:01+00:00',
            updatedAt: '2005-08-15T15:55:01+00:00',
            name: 'Brownie',
            tag: '0001-000',
            vaccinations: [{ name: 'Rabies' }],
            _links: {
              read: { href: '/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9' },
              update: { href: '/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9' },
              delete: { href: '/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9' },
            },
          },
        ],
        _links: {
          create: { href: '/api/pets' },
        },
      }),
    },
    {
      parameters: [
        {
          offset: 0,
          limit: 10,
          filters: {},
          sort: {},
        },
      ],
      return: Promise.resolve({
        offset: 0,
        limit: 10,
        filters: {},
        sort: {},
        count: 1,
        items: [
          {
            id: '4d783b77-eb09-4603-b99b-f590b605eaa9',
            createdAt: '2005-08-15T15:52:01+00:00',
            updatedAt: '2005-08-15T15:55:01+00:00',
            name: 'Brownie',
            tag: '0001-000',
            vaccinations: [{ name: 'Rabies' }],
            _links: {
              read: { href: '/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9' },
              update: { href: '/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9' },
              delete: { href: '/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9' },
            },
          },
        ],
        _links: {
          create: { href: '/api/pets' },
        },
      }),
    },
  ];

  mockListPetsClient = async (petListRequest: PetListRequest) => {
    // eslint-disable-next-line functional/immutable-data
    const petListCall = petListCalls.shift();
    if (!petListCall) {
      throw new Error('Missing call');
    }

    expect(petListRequest).toEqual(petListCall.parameters[0]);

    return petListCall.return;
  };

  mockDeletePetClient = async (id: string) => {
    expect(id).toBe('4d783b77-eb09-4603-b99b-f590b605eaa9');

    return undefined;
  };

  const router = createRouter({
    history: createWebHistory(),
    routes: [
      { path: '/', name: 'Home', component: defineComponent(() => () => <div data-testid="page-home-mock" />) },
      { path: '/pet', name: 'PetList', component: () => import('../../../../src/component/page/pet/list') },
      {
        path: '/pet/create',
        name: 'PetCreate',
        component: defineComponent(() => () => <div data-testid="page-pet-create-mock" />),
      },
      {
        path: '/pet/4d783b77-eb09-4603-b99b-f590b605eaa9',
        name: 'PetRead',
        component: defineComponent(() => () => <div data-testid="page-pet-read-mock" />),
      },
      {
        path: '/pet/4d783b77-eb09-4603-b99b-f590b605eaa9/update',
        name: 'PetUpdate',
        component: defineComponent(() => () => <div data-testid="page-pet-update-mock" />),
      },
    ],
  });

  render(<RouterView />, {
    global: {
      plugins: [router],
    },
  });

  await router.push('/pet');

  await screen.findByTestId('page-pet-list');

  const removeButton = await screen.findByTestId('remove-pet-0');

  await userEvent.click(removeButton);
});

test('submit', async () => {
  const petListCalls: Array<{ parameters: [PetListRequest]; return: Promise<PetListResponse> }> = [
    {
      parameters: [
        {
          offset: 0,
          limit: 10,
          filters: {},
          sort: {},
        },
      ],
      return: Promise.resolve({
        offset: 0,
        limit: 10,
        filters: {},
        sort: {},
        count: 1,
        items: [
          {
            id: '4d783b77-eb09-4603-b99b-f590b605eaa9',
            createdAt: '2005-08-15T15:52:01+00:00',
            updatedAt: '2005-08-15T15:55:01+00:00',
            name: 'Brownie',
            tag: '0001-000',
            vaccinations: [{ name: 'Rabies' }],
            _links: {
              read: { href: '/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9' },
              update: { href: '/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9' },
              delete: { href: '/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9' },
            },
          },
        ],
        _links: {
          create: { href: '/api/pets' },
        },
      }),
    },
    {
      parameters: [
        {
          offset: 0,
          limit: 10,
          filters: {},
          sort: { name: 'desc' },
        },
      ],
      return: Promise.resolve({
        offset: 0,
        limit: 10,
        filters: {},
        sort: { name: 'desc' },
        count: 1,
        items: [
          {
            id: '4d783b77-eb09-4603-b99b-f590b605eaa9',
            createdAt: '2005-08-15T15:52:01+00:00',
            updatedAt: '2005-08-15T15:55:01+00:00',
            name: 'Blacky',
            tag: '0002-000',
            vaccinations: [{ name: 'Rabies' }],
            _links: {
              read: { href: '/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9' },
              update: { href: '/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9' },
              delete: { href: '/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9' },
            },
          },
        ],
        _links: {
          create: { href: '/api/pets' },
        },
      }),
    },
    {
      parameters: [
        {
          offset: 0,
          limit: 10,
          filters: { name: 'Brownie' },
          sort: { name: 'desc' },
        },
      ],
      return: Promise.resolve({
        offset: 0,
        limit: 10,
        filters: { name: 'Brownie' },
        sort: { name: 'desc' },
        count: 0,
        items: [],
        _links: {
          create: { href: '/api/pets' },
        },
      }),
    },
    {
      parameters: [
        {
          offset: 10,
          limit: 10,
          filters: { name: 'Brownie' },
          sort: { name: 'desc' },
        },
      ],
      return: Promise.resolve({
        offset: 10,
        limit: 10,
        filters: { name: 'Brownie' },
        sort: { name: 'desc' },
        count: 0,
        items: [],
        _links: {
          create: { href: '/api/pets' },
        },
      }),
    },
  ];

  mockListPetsClient = async (petListRequest: PetListRequest) => {
    // eslint-disable-next-line functional/immutable-data
    const petListCall = petListCalls.shift();
    if (!petListCall) {
      throw new Error('Missing call');
    }

    expect(petListRequest).toEqual(petListCall.parameters[0]);

    return petListCall.return;
  };

  mockDeletePetClient = async () => undefined;

  const router = createRouter({
    history: createWebHistory(),
    routes: [
      { path: '/', name: 'Home', component: defineComponent(() => () => <div data-testid="page-home-mock" />) },
      { path: '/pet', name: 'PetList', component: () => import('../../../../src/component/page/pet/list') },
      {
        path: '/pet/create',
        name: 'PetCreate',
        component: defineComponent(() => () => <div data-testid="page-pet-create-mock" />),
      },
      {
        path: '/pet/4d783b77-eb09-4603-b99b-f590b605eaa9',
        name: 'PetRead',
        component: defineComponent(() => () => <div data-testid="page-pet-read-mock" />),
      },
      {
        path: '/pet/4d783b77-eb09-4603-b99b-f590b605eaa9/update',
        name: 'PetUpdate',
        component: defineComponent(() => () => <div data-testid="page-pet-update-mock" />),
      },
    ],
  });

  render(<RouterView />, {
    global: {
      plugins: [router],
    },
  });

  await router.push('/pet');
  await screen.findByTestId('page-pet-list');

  const petSortNameSubmitButton = await screen.findByTestId('pet-sort-name-desc');

  await userEvent.click(petSortNameSubmitButton);

  await screen.findByTestId('page-pet-list');

  const petFiltersFormSubmitButton = await screen.findByTestId('pet-filters-form-submit');

  await userEvent.click(petFiltersFormSubmitButton);

  await screen.findByTestId('page-pet-list');

  const paginationNextButton = await screen.findByTestId('pagination-next');

  await userEvent.click(paginationNextButton);
});
