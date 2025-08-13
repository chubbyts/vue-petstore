/** @jsxImportSource vue */

import { vi, test, expect, describe } from 'vitest';
import { render, screen } from '@testing-library/vue';
import { userEvent } from '@testing-library/user-event';
import { defineComponent } from 'vue';
import { createRouter, createWebHistory, RouterView } from 'vue-router';
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query';
import nock from 'nock';
import type { PetRequest, PetResponse } from '../../../../src/model/pet';
import { formatHtml } from '../../../formatter';
import type { HttpError } from '../../../../src/client/error';

vi.mock('../../../../src/component/form/pet-form', () => {
  return {
    __esModule: true,
    PetForm: defineComponent(
      (props: { httpError: HttpError | undefined; initialPet?: PetRequest; submitPet: (pet: PetRequest) => void }) => {
        const onSubmit = () => {
          props.submitPet({ name: 'Brownie', vaccinations: [] });
        };

        return () => (
          <button
            data-testid="pet-form-submit"
            data-has-http-error={!!props.httpError}
            data-has-initial-pet={!!props.initialPet}
            onClick={onSubmit}
          />
        );
      },
      { props: ['httpError', 'initialPet', 'submitPet'] },
    ),
  };
});

describe('update', () => {
  test('not found', async () => {
    nock('https://petstore.test').get('/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9').reply(404, {
      type: 'https://datatracker.ietf.org/doc/html/rfc2616#section-10.4.5',
      status: 404,
      title: 'Not Found',
      _httpError: 'NotFound',
      detail: 'There is no entry with id "4d783b77-eb09-4603-b99b-f590b605eaa9"',
    });

    const router = createRouter({
      history: createWebHistory(),
      routes: [
        { path: '/', name: 'Home', component: defineComponent(() => () => <div data-testid="page-home-mock" />) },
        {
          path: '/pet',
          name: 'PetList',
          component: defineComponent(() => () => <div data-testid="page-pet-list-mock" />),
        },
        {
          path: '/pet/:id/update',
          name: 'PetUpdate',
          component: () => import('../../../../src/component/page/pet/update'),
        },
      ],
    });

    const { container } = render(<RouterView />, {
      global: {
        plugins: [
          [
            VueQueryPlugin,
            {
              queryClient: new QueryClient({
                defaultOptions: {
                  queries: {
                    retry: false,
                  },
                },
              }),
            },
          ],
          router,
        ],
      },
    });

    await router.push('/pet/4d783b77-eb09-4603-b99b-f590b605eaa9/update');

    await screen.findByTestId('page-pet-update');

    expect(formatHtml(container.outerHTML)).toMatchInlineSnapshot(`
      "<div>
        <div data-testid="page-pet-update">
          <div data-testid="http-error" class="mb-6 bg-red-300 px-5 py-4">
            <p class="font-bold">Not Found</p>
            <p>There is no entry with id "4d783b77-eb09-4603-b99b-f590b605eaa9"</p>
            <!----><!---->
          </div>
          <h1 class="mb-4 border-b border-gray-200 pb-2 text-4xl font-black">
            Pet Update
          </h1>
          <!----><a
            href="/pet"
            class="inline-block px-5 py-2 text-white bg-gray-600 hover:bg-gray-700"
            colortheme="gray"
            >List</a
          >
        </div>
      </div>
      "
    `);
  });

  test('default', async () => {
    const petResponse: PetResponse = {
      id: '0a006ee6-7840-439a-8801-cee1d0f1e692',
      createdAt: '2005-08-15T15:52:01+00:00',
      updatedAt: '2005-08-15T15:55:01+00:00',
      name: 'Brownie',
      tag: '0001-000',
      vaccinations: [{ name: 'Rabies' }],
      _links: {},
    };

    nock('https://petstore.test').get('/api/pets/0a006ee6-7840-439a-8801-cee1d0f1e692').reply(200, petResponse);

    const router = createRouter({
      history: createWebHistory(),
      routes: [
        { path: '/', name: 'Home', component: defineComponent(() => () => <div data-testid="page-home-mock" />) },
        {
          path: '/pet',
          name: 'PetList',
          component: defineComponent(() => () => <div data-testid="page-pet-list-mock" />),
        },
        {
          path: '/pet/:id/update',
          name: 'PetUpdate',
          component: () => import('../../../../src/component/page/pet/update'),
        },
      ],
    });

    const { container } = render(<RouterView />, {
      global: {
        plugins: [
          [
            VueQueryPlugin,
            {
              queryClient: new QueryClient({
                defaultOptions: {
                  queries: {
                    retry: false,
                  },
                },
              }),
            },
          ],
          router,
        ],
      },
    });

    await router.push('/pet/0a006ee6-7840-439a-8801-cee1d0f1e692/update');

    await screen.findByTestId('page-pet-update');

    expect(formatHtml(container.outerHTML)).toMatchInlineSnapshot(`
      "<div>
        <div data-testid="page-pet-update">
          <!---->
          <h1 class="mb-4 border-b border-gray-200 pb-2 text-4xl font-black">
            Pet Update
          </h1>
          <button
            data-testid="pet-form-submit"
            data-has-http-error="false"
            data-has-initial-pet="true"
          ></button
          ><a
            href="/pet"
            class="inline-block px-5 py-2 text-white bg-gray-600 hover:bg-gray-700"
            colortheme="gray"
            >List</a
          >
        </div>
      </div>
      "
    `);
  });

  test('unprocessable entity', async () => {
    const petResponse: PetResponse = {
      id: '796348ce-c637-4096-8d8d-238368924d2f',
      createdAt: '2005-08-15T15:52:01+00:00',
      updatedAt: '2005-08-15T15:55:01+00:00',
      name: 'Brownie',
      tag: '0001-000',
      vaccinations: [{ name: 'Rabies' }],
      _links: {},
    };

    nock('https://petstore.test').get('/api/pets/796348ce-c637-4096-8d8d-238368924d2f').reply(200, petResponse);

    nock('https://petstore.test')
      .put('/api/pets/796348ce-c637-4096-8d8d-238368924d2f', { name: 'Brownie', vaccinations: [] })
      .reply(422, {
        type: 'https://datatracker.ietf.org/doc/html/rfc2616#section-10.4.5',
        status: 422,
        title: 'Unprocessable Entity',
        _httpError: 'UnprocessableEntity',
        detail: 'Field validation issues',
      });

    const router = createRouter({
      history: createWebHistory(),
      routes: [
        { path: '/', name: 'Home', component: defineComponent(() => () => <div data-testid="page-home-mock" />) },
        {
          path: '/pet',
          name: 'PetList',
          component: defineComponent(() => () => <div data-testid="page-pet-list-mock" />),
        },
        {
          path: '/pet/:id/update',
          name: 'PetUpdate',
          component: () => import('../../../../src/component/page/pet/update'),
        },
      ],
    });

    const { container } = render(<RouterView />, {
      global: {
        plugins: [
          [
            VueQueryPlugin,
            {
              queryClient: new QueryClient({
                defaultOptions: {
                  queries: {
                    retry: false,
                  },
                },
              }),
            },
          ],
          router,
        ],
      },
    });

    await router.push('/pet/796348ce-c637-4096-8d8d-238368924d2f/update');

    const testButton = await screen.findByTestId('pet-form-submit');

    await userEvent.click(testButton);

    await screen.findByTestId('http-error');

    expect(formatHtml(container.outerHTML)).toMatchInlineSnapshot(`
      "<div>
        <div data-testid="page-pet-update">
          <div data-testid="http-error" class="mb-6 bg-red-300 px-5 py-4">
            <p class="font-bold">Unprocessable Entity</p>
            <p>Field validation issues</p>
            <!----><!---->
          </div>
          <h1 class="mb-4 border-b border-gray-200 pb-2 text-4xl font-black">
            Pet Update
          </h1>
          <button
            data-testid="pet-form-submit"
            data-has-http-error="true"
            data-has-initial-pet="true"
          ></button
          ><a
            href="/pet"
            class="inline-block px-5 py-2 text-white bg-gray-600 hover:bg-gray-700"
            colortheme="gray"
            >List</a
          >
        </div>
      </div>
      "
    `);
  });

  test('successful', async () => {
    const petRequest: PetRequest = {
      name: 'Brownie',
      tag: '0001-000',
      vaccinations: [{ name: 'Rabies' }],
    };

    const petResponse: PetResponse = {
      id: 'fd115a9b-c4df-4bc0-ae2a-8b59b00502f2',
      createdAt: '2005-08-15T15:52:01+00:00',
      updatedAt: '2005-08-15T15:55:01+00:00',
      ...petRequest,
      _links: {},
    };

    nock('https://petstore.test').get('/api/pets/fd115a9b-c4df-4bc0-ae2a-8b59b00502f2').reply(200, petResponse);

    nock('https://petstore.test')
      .put('/api/pets/fd115a9b-c4df-4bc0-ae2a-8b59b00502f2', { name: 'Brownie', vaccinations: [] })
      .reply(200, petResponse);

    const router = createRouter({
      history: createWebHistory(),
      routes: [
        { path: '/', name: 'Home', component: defineComponent(() => () => <div data-testid="page-home-mock" />) },
        {
          path: '/pet',
          name: 'PetList',
          component: defineComponent(() => () => <div data-testid="page-pet-list-mock" />),
        },
        {
          path: '/pet/:id/update',
          name: 'PetUpdate',
          component: () => import('../../../../src/component/page/pet/update'),
        },
      ],
    });

    const { container } = render(<RouterView />, {
      global: {
        plugins: [
          [
            VueQueryPlugin,
            {
              queryClient: new QueryClient({
                defaultOptions: {
                  queries: {
                    retry: false,
                  },
                },
              }),
            },
          ],
          router,
        ],
      },
    });

    await router.push('/pet/fd115a9b-c4df-4bc0-ae2a-8b59b00502f2/update');

    const testButton = await screen.findByTestId('pet-form-submit');

    await userEvent.click(testButton);

    await screen.findByTestId('page-pet-list-mock');

    expect(formatHtml(container.outerHTML)).toMatchInlineSnapshot(`
      "<div><div data-testid="page-pet-list-mock"></div></div>
      "
    `);
  });
});
