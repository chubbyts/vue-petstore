/** @jsxImportSource vue */

import { vi, test, expect, describe } from 'vitest';
import { render, screen } from '@testing-library/vue';
import { defineComponent } from 'vue';
import { createRouter, createWebHistory, RouterView } from 'vue-router';
import { userEvent } from '@testing-library/user-event';
import type { PetRequest, PetResponse } from '../../../../src/model/pet';
import { formatHtml } from '../../../formatter';
import { UnprocessableEntity } from '../../../../src/client/error';
import type { HttpError } from '../../../../src/client/error';
import type { createPetClient } from '../../../../src/client/pet';

// eslint-disable-next-line functional/no-let
let mockCreatePetClient: typeof createPetClient;

vi.mock('../../../../src/client/pet', () => {
  return {
    // eslint-disable-next-line functional/prefer-tacit
    createPetClient: (pet: PetRequest) => {
      return mockCreatePetClient(pet);
    },
  };
});

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
        plugins: [router],
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
    mockCreatePetClient = async (_: PetRequest) => {
      return new Promise<UnprocessableEntity>((resolve) =>
        resolve(new UnprocessableEntity({ title: 'unprocessable entity' })),
      );
    };

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
        plugins: [router],
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
          <p class="font-bold">unprocessable entity</p>
          <!----><!----><!---->
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
    mockCreatePetClient = async (petRequest: PetRequest) => {
      const petResponse: PetResponse = {
        id: '4d783b77-eb09-4603-b99b-f590b605eaa9',
        createdAt: '2005-08-15T15:52:01+00:00',
        ...petRequest,
        _links: {},
      };
      return new Promise<PetResponse>((resolve) => resolve(petResponse));
    };

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
        plugins: [router],
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
