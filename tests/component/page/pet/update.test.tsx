/** @jsxImportSource vue */

import { vi, test, expect } from 'vitest';
import type { PetRequest, PetResponse } from '../../../../src/model/pet';
import { formatHtml } from '../../../formatter';
import type { HttpError } from '../../../../src/client/error';
import { NotFound, UnprocessableEntity } from '../../../../src/client/error';
import type { readPetClient, updatePetClient } from '../../../../src/client/pet';
import { render, screen } from '@testing-library/vue';
import { userEvent } from '@testing-library/user-event';
import { defineComponent } from 'vue';
import { createRouter, createWebHistory, RouterView } from 'vue-router';

let mockReadPetClient: typeof readPetClient;
let mockUpdatePetClient: typeof updatePetClient;

vi.mock('../../../../src/client/pet', () => {
  return {
    readPetClient: (id: string) => {
      return mockReadPetClient(id);
    },
    updatePetClient: (id: string, pet: PetRequest) => {
      return mockUpdatePetClient(id, pet);
    },
  };
});

vi.mock('../../../../src/component/form/pet-form', () => {
  return {
    __esModule: true,
    PetForm: defineComponent((props: { httpError: HttpError | undefined; initialPet?: PetRequest; submitPet: (pet: PetRequest) => void; }) => {
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
    }, { props: ['httpError', 'initialPet', 'submitPet'] }),
  };
});

test('not found', async () => {
  mockReadPetClient = async (id: string) => {
    expect(id).toBe('4d783b77-eb09-4603-b99b-f590b605eaa9');

    return new Promise<NotFound>((resolve) => resolve(new NotFound({ title: 'title' })));
  };

  const router = createRouter({
    history: createWebHistory(),
    routes: [
      { path: '/', name: 'Home', component: defineComponent(() => () => <div data-testid="page-home-mock" />) },
      { path: '/pet/:id/update', name: 'PetUpdate', component: () => import('../../../../src/component/page/pet/update') },
    ]
  });

  const { container } = render(<RouterView />, {
    global: {
      plugins: [router],
    },
  });

  await router.push('/pet/4d783b77-eb09-4603-b99b-f590b605eaa9/update');

  await screen.findByTestId('page-pet-update');

  expect(formatHtml(container.outerHTML)).toMatchInlineSnapshot(`
    "<div>
      <div data-testid="page-pet-update">
        <div data-testid="http-error" class="mb-6 bg-red-300 px-5 py-4">
          <p class="font-bold">title</p>
          <!----><!----><!---->
        </div>
        <h1 class="mb-4 border-b pb-2 text-4xl font-black">Pet Update</h1>
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
      { path: '/pet/:id/update', name: 'PetUpdate', component: () => import('../../../../src/component/page/pet/update') },
    ]
  });

  const { container } = render(<RouterView />, {
    global: {
      plugins: [router],
    },
  });

  await router.push('/pet/4d783b77-eb09-4603-b99b-f590b605eaa9/update');

  await screen.findByTestId('page-pet-update');

  expect(formatHtml(container.outerHTML)).toMatchInlineSnapshot(`
    "<div>
      <div data-testid="page-pet-update">
        <!---->
        <h1 class="mb-4 border-b pb-2 text-4xl font-black">Pet Update</h1>
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

  mockUpdatePetClient = async (id: string) => {
    expect(id).toBe('4d783b77-eb09-4603-b99b-f590b605eaa9');

    return new Promise<UnprocessableEntity>((resolve) =>
      resolve(new UnprocessableEntity({ title: 'unprocessable entity' })),
    );
  };

  const router = createRouter({
    history: createWebHistory(),
    routes: [
      { path: '/', name: 'Home', component: defineComponent(() => () => <div data-testid="page-home-mock" />) },
      { path: '/pet/:id/update', name: 'PetUpdate', component: () => import('../../../../src/component/page/pet/update') },
    ]
  });

  const { container } = render(<RouterView />, {
    global: {
      plugins: [router],
    },
  });

  await router.push('/pet/4d783b77-eb09-4603-b99b-f590b605eaa9/update');

  const testButton = await screen.findByTestId('pet-form-submit');

  await userEvent.click(testButton);

  await screen.findByTestId('http-error');

  expect(formatHtml(container.outerHTML)).toMatchInlineSnapshot(`
    "<div>
      <div data-testid="page-pet-update">
        <div data-testid="http-error" class="mb-6 bg-red-300 px-5 py-4">
          <p class="font-bold">unprocessable entity</p>
          <!----><!----><!---->
        </div>
        <h1 class="mb-4 border-b pb-2 text-4xl font-black">Pet Update</h1>
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
    id: '4d783b77-eb09-4603-b99b-f590b605eaa9',
    createdAt: '2005-08-15T15:52:01+00:00',
    updatedAt: '2005-08-15T15:55:01+00:00',
    ...petRequest,
    _links: {},
  };

  mockReadPetClient = async (id: string) => {
    expect(id).toBe('4d783b77-eb09-4603-b99b-f590b605eaa9');

    return new Promise<PetResponse>((resolve) => resolve(petResponse));
  };

  mockUpdatePetClient = async (id: string, petRequest: PetRequest) => {
    expect(id).toBe('4d783b77-eb09-4603-b99b-f590b605eaa9');

    expect(petRequest).toEqual(petRequest);

    return new Promise<PetResponse>((resolve) => resolve(petResponse));
  };

  const router = createRouter({
    history: createWebHistory(),
    routes: [
      { path: '/', name: 'Home', component: defineComponent(() => () => <div data-testid="page-home-mock" />) },
      { path: '/pet', name: 'PetList', component: defineComponent(() => () => <div data-testid="page-pet-list-mock" />) },
      { path: '/pet/:id/update', name: 'PetUpdate', component: () => import('../../../../src/component/page/pet/update') },
    ]
  });

  const { container } = render(<RouterView />, {
    global: {
      plugins: [router],
    },
  });

  await router.push('/pet/4d783b77-eb09-4603-b99b-f590b605eaa9/update');

  const testButton = await screen.findByTestId('pet-form-submit');

  await userEvent.click(testButton);

  await screen.findByTestId('page-pet-list-mock');

  expect(formatHtml(container.outerHTML)).toMatchInlineSnapshot(`
    "<div><div data-testid="page-pet-list-mock"></div></div>
    "
  `);
});
