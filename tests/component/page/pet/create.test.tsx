/** @jsxImportSource vue */

import { vi, test, expect, describe } from 'vitest';
import { render, screen } from '@testing-library/vue';
import { defineComponent } from 'vue';
import { createRouter, createWebHistory, RouterView } from 'vue-router';
import { userEvent } from '@testing-library/user-event';
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query';
import nock from 'nock';
import type { PetRequest } from '../../../../src/model/pet';
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

describe('create', () => {
  test('default', async () => {
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
          path: '/pet/create',
          name: 'PetCreate',
          component: () => import('../../../../src/component/page/pet/create'),
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

    await router.push('/pet/create');

    await screen.findByTestId('page-pet-create');

    expect(formatHtml(container.outerHTML)).toMatchInlineSnapshot(`
      "<div>
        <div data-testid="page-pet-create">
          <!---->
          <h1 class="mb-4 border-b border-gray-200 pb-2 text-4xl font-black">
            Pet Create
          </h1>
          <button
            data-testid="pet-form-submit"
            data-has-http-error="false"
            data-has-initial-pet="false"
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
    nock('https://petstore.test').post('/api/pets', { name: 'Brownie', vaccinations: [] }).reply(422, {
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
          path: '/pet/create',
          name: 'PetCreate',
          component: () => import('../../../../src/component/page/pet/create'),
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

    await router.push('/pet/create');

    const testButton = await screen.findByTestId('pet-form-submit');

    await userEvent.click(testButton);

    await screen.findByTestId('http-error');

    expect(formatHtml(container.outerHTML)).toMatchInlineSnapshot(`
      "<div>
        <div data-testid="page-pet-create">
          <div data-testid="http-error" class="mb-6 bg-red-300 px-5 py-4">
            <p class="font-bold">Unprocessable Entity</p>
            <p>Field validation issues</p>
            <!----><!---->
          </div>
          <h1 class="mb-4 border-b border-gray-200 pb-2 text-4xl font-black">
            Pet Create
          </h1>
          <button
            data-testid="pet-form-submit"
            data-has-http-error="true"
            data-has-initial-pet="false"
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
    nock('https://petstore.test').post('/api/pets', { name: 'Brownie', vaccinations: [] }).reply(201, {
      id: '4d783b77-eb09-4603-b99b-f590b605eaa9',
      createdAt: '2005-08-15T15:52:01+00:00',
      name: 'Brownie',
      vaccinations: [],
      _links: {},
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
          path: '/pet/create',
          name: 'PetCreate',
          component: () => import('../../../../src/component/page/pet/create'),
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

    await router.push('/pet/create');

    const testButton = await screen.findByTestId('pet-form-submit');

    await userEvent.click(testButton);

    await screen.findByTestId('page-pet-list-mock');

    expect(formatHtml(container.outerHTML)).toMatchInlineSnapshot(`
      "<div><div data-testid="page-pet-list-mock"></div></div>
      "
    `);
  });
});
