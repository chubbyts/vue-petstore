/** @jsxImportSource vue */

import { vi, test, expect, describe } from 'vitest';
import { render, screen } from '@testing-library/vue';
import { createRouter, createWebHistory, RouterView } from 'vue-router';
import { defineComponent } from 'vue';
import { formatHtml } from '../../../formatter';
import { NotFound } from '../../../../src/client/error';
import type { readPetClient } from '../../../../src/client/pet';
import type { PetResponse } from '../../../../src/model/pet';

// eslint-disable-next-line functional/no-let
let mockReadPetClient: typeof readPetClient;

vi.mock('../../../../src/client/pet', () => {
  return {
    // eslint-disable-next-line functional/prefer-tacit
    readPetClient: (id: string) => {
      return mockReadPetClient(id);
    },
  };
});

describe('read', () => {
  test('not found', async () => {
    mockReadPetClient = async (id: string) => {
      expect(id).toBe('4d783b77-eb09-4603-b99b-f590b605eaa9');

      return new Promise<NotFound>((resolve) => resolve(new NotFound({ title: 'title' })));
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
        { path: '/pet/:id', name: 'PetRead', component: () => import('../../../../src/component/page/pet/read') },
      ],
    });

    const { container } = render(<RouterView />, {
      global: {
        plugins: [router],
      },
    });

    await router.push('/pet/4d783b77-eb09-4603-b99b-f590b605eaa9');

    await screen.findByTestId('page-pet-read');

    expect(formatHtml(container.outerHTML)).toMatchInlineSnapshot(`
    "<div>
      <div data-testid="page-pet-read">
        <div data-testid="http-error" class="mb-6 bg-red-300 px-5 py-4">
          <p class="font-bold">title</p>
          <!----><!----><!---->
        </div>
        <h1 class="mb-4 border-b border-gray-200 pb-2 text-4xl font-black">
          Pet Read
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

  test('success without vaccinations', async () => {
    const petResponse: PetResponse = {
      id: '4d783b77-eb09-4603-b99b-f590b605eaa9',
      createdAt: '2005-08-15T15:52:01+00:00',
      updatedAt: '2005-08-15T15:55:01+00:00',
      name: 'Brownie',
      tag: '0001-000',
      vaccinations: [],
      _links: {},
    };

    mockReadPetClient = async (id: string) => {
      expect(id).toBe('4d783b77-eb09-4603-b99b-f590b605eaa9');

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
        { path: '/pet/:id', name: 'PetRead', component: () => import('../../../../src/component/page/pet/read') },
      ],
    });

    const { container } = render(<RouterView />, {
      global: {
        plugins: [router],
      },
    });

    await router.push('/pet/4d783b77-eb09-4603-b99b-f590b605eaa9');

    await screen.findByTestId('page-pet-read');

    expect(formatHtml(container.outerHTML)).toMatchInlineSnapshot(`
    "<div>
      <div data-testid="page-pet-read">
        <!---->
        <h1 class="mb-4 border-b border-gray-200 pb-2 text-4xl font-black">
          Pet Read
        </h1>
        <div>
          <dl>
            <dt class="font-bold">Id</dt>
            <dd class="mb-4">4d783b77-eb09-4603-b99b-f590b605eaa9</dd>
            <dt class="font-bold">CreatedAt</dt>
            <dd class="mb-4">15.08.2005 - 17:52:01</dd>
            <dt class="font-bold">UpdatedAt</dt>
            <dd class="mb-4">15.08.2005 - 17:55:01</dd>
            <dt class="font-bold">Name</dt>
            <dd class="mb-4">Brownie</dd>
            <dt class="font-bold">Tag</dt>
            <dd class="mb-4">0001-000</dd>
            <dt class="font-bold">Vaccinations</dt>
            <dd class="mb-4"><!----></dd>
          </dl>
        </div>
        <a
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

  test('success with vaccinations', async () => {
    const petResponse: PetResponse = {
      id: '4d783b77-eb09-4603-b99b-f590b605eaa9',
      createdAt: '2005-08-15T15:52:01+00:00',
      updatedAt: '2005-08-15T15:55:01+00:00',
      name: 'Brownie',
      tag: '0001-000',
      vaccinations: [{ name: 'Rabies' }],
      _links: {},
    };

    mockReadPetClient = async (id: string) => {
      expect(id).toBe('4d783b77-eb09-4603-b99b-f590b605eaa9');

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
        { path: '/pet/:id', name: 'PetRead', component: () => import('../../../../src/component/page/pet/read') },
      ],
    });

    const { container } = render(<RouterView />, {
      global: {
        plugins: [router],
      },
    });

    await router.push('/pet/4d783b77-eb09-4603-b99b-f590b605eaa9');

    await screen.findByTestId('page-pet-read');

    expect(formatHtml(container.outerHTML)).toMatchInlineSnapshot(`
    "<div>
      <div data-testid="page-pet-read">
        <!---->
        <h1 class="mb-4 border-b border-gray-200 pb-2 text-4xl font-black">
          Pet Read
        </h1>
        <div>
          <dl>
            <dt class="font-bold">Id</dt>
            <dd class="mb-4">4d783b77-eb09-4603-b99b-f590b605eaa9</dd>
            <dt class="font-bold">CreatedAt</dt>
            <dd class="mb-4">15.08.2005 - 17:52:01</dd>
            <dt class="font-bold">UpdatedAt</dt>
            <dd class="mb-4">15.08.2005 - 17:55:01</dd>
            <dt class="font-bold">Name</dt>
            <dd class="mb-4">Brownie</dd>
            <dt class="font-bold">Tag</dt>
            <dd class="mb-4">0001-000</dd>
            <dt class="font-bold">Vaccinations</dt>
            <dd class="mb-4">
              <ul>
                <li>Rabies</li>
              </ul>
            </dd>
          </dl>
        </div>
        <a
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
});
