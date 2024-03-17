import { describe, expect, test } from 'vitest';
import { createModelResource } from '../../src/hook/create-model-resource';
import { useFunctionMock } from '@chubbyts/chubbyts-function-mock/dist/function-mock';
import type { CreateClient, ReadClient, DeleteClient, ListClient, UpdateClient } from '../../src/client/client';
import type { ModelListRequest, ModelListResponse, ModelRequest, ModelResponse } from '../../src/model/model';
import { BadRequest } from '../../src/client/error';

describe('createModelResource', () => {
  describe('list', () => {
    test('missing client', async () => {
      const { actions } = createModelResource({});

      try {
        await actions.listModel({});
        throw new Error('expect failed');
      } catch (e) {
        expect(e).toMatchInlineSnapshot('[Error: Missing listClient]');
      }
    });

    test('error', async () => {
      const badRequest = new BadRequest({ title: 'bad request' });

      const [listClient, listClientMocks] = useFunctionMock<ListClient<ModelListRequest, ModelListResponse>>([
        { parameters: [{}], return: Promise.resolve(badRequest) },
      ]);

      const { modelList, httpError, actions } = createModelResource({ listClient });

      expect(modelList.value).toBeUndefined();
      expect(httpError.value).toBeUndefined();

      expect(await actions.listModel({})).toBe(false);

      expect(modelList.value).toBeUndefined();
      expect(httpError.value).toEqual(badRequest);

      expect(listClientMocks.length).toBe(0);
    });

    test('success', async () => {
      const modelListResponse: ModelListResponse = {
        offset: 0,
        limit: 10,
        filters: {},
        sort: {},
        count: 0,
        items: [],
        _links: {},
      };

      const [listClient, listClientMocks] = useFunctionMock<ListClient<ModelListRequest, ModelListResponse>>([
        { parameters: [{}], return: Promise.resolve(modelListResponse) },
      ]);

      const { modelList, httpError, actions } = createModelResource({ listClient });

      expect(modelList.value).toBeUndefined();
      expect(httpError.value).toBeUndefined();

      expect(await actions.listModel({})).toBe(true);

      expect(modelList.value).toEqual(modelListResponse);
      expect(httpError.value).toBeUndefined();

      expect(listClientMocks.length).toBe(0);
    });
  });

  describe('create', () => {
    test('missing client', async () => {
      const { actions } = createModelResource({});

      try {
        await actions.createModel({});
        throw new Error('expect failed');
      } catch (e) {
        expect(e).toMatchInlineSnapshot('[Error: Missing createClient]');
      }
    });

    test('error', async () => {
      const badRequest = new BadRequest({ title: 'bad request' });

      const [createClient, createClientMocks] = useFunctionMock<CreateClient<ModelRequest, ModelResponse>>([
        { parameters: [{}], return: Promise.resolve(badRequest) },
      ]);

      const { model, httpError, actions } = createModelResource({ createClient });

      expect(model.value).toBeUndefined();
      expect(httpError.value).toBeUndefined();

      expect(await actions.createModel({})).toBe(false);

      expect(model.value).toBeUndefined();
      expect(httpError.value).toEqual(badRequest);

      expect(createClientMocks.length).toBe(0);
    });

    test('success', async () => {
      const modelResponse: ModelResponse = {
        id: 'ddbb7edb-8c53-4586-9844-769e1c830719',
        createdAt: '2022-06-12T20:08:24.793Z',
        _links: {},
      };

      const [createClient, createClientMocks] = useFunctionMock<CreateClient<ModelRequest, ModelResponse>>([
        { parameters: [{}], return: Promise.resolve(modelResponse) },
      ]);

      const { model, httpError, actions } = createModelResource({ createClient });

      expect(model.value).toBeUndefined();
      expect(httpError.value).toBeUndefined();

      expect(await actions.createModel({})).toBe(true);

      expect(model.value).toEqual(modelResponse);
      expect(httpError.value).toBeUndefined();

      expect(createClientMocks.length).toBe(0);
    });
  });

  describe('read', () => {
    test('missing client', async () => {
      const { actions } = createModelResource({});

      try {
        await actions.readModel('ddbb7edb-8c53-4586-9844-769e1c830719');
        throw new Error('expect failed');
      } catch (e) {
        expect(e).toMatchInlineSnapshot('[Error: Missing readClient]');
      }
    });

    test('error', async () => {
      const badRequest = new BadRequest({ title: 'bad request' });

      const [readClient, readClientMocks] = useFunctionMock<ReadClient<ModelResponse>>([
        { parameters: ['ddbb7edb-8c53-4586-9844-769e1c830719'], return: Promise.resolve(badRequest) },
      ]);

      const { model, httpError, actions } = createModelResource({ readClient });

      expect(model.value).toBeUndefined();
      expect(httpError.value).toBeUndefined();

      expect(await actions.readModel('ddbb7edb-8c53-4586-9844-769e1c830719')).toBe(false);

      expect(model.value).toBeUndefined();
      expect(httpError.value).toEqual(badRequest);

      expect(readClientMocks.length).toBe(0);
    });

    test('success', async () => {
      const modelResponse: ModelResponse = {
        id: 'ddbb7edb-8c53-4586-9844-769e1c830719',
        createdAt: '2022-06-12T20:08:24.793Z',
        _links: {},
      };

      const [readClient, readClientMocks] = useFunctionMock<ReadClient<ModelResponse>>([
        { parameters: ['ddbb7edb-8c53-4586-9844-769e1c830719'], return: Promise.resolve(modelResponse) },
      ]);

      const { model, httpError, actions } = createModelResource({ readClient });

      expect(model.value).toBeUndefined();
      expect(httpError.value).toBeUndefined();

      expect(await actions.readModel('ddbb7edb-8c53-4586-9844-769e1c830719')).toBe(true);

      expect(model.value).toEqual(modelResponse);
      expect(httpError.value).toBeUndefined();

      expect(readClientMocks.length).toBe(0);
    });
  });

  describe('update', () => {
    test('missing client', async () => {
      const { actions } = createModelResource({});

      try {
        await actions.updateModel('ddbb7edb-8c53-4586-9844-769e1c830719', {});
        throw new Error('expect failed');
      } catch (e) {
        expect(e).toMatchInlineSnapshot('[Error: Missing updateClient]');
      }
    });

    test('error', async () => {
      const badRequest = new BadRequest({ title: 'bad request' });

      const [updateClient, updateClientMocks] = useFunctionMock<UpdateClient<ModelRequest, ModelResponse>>([
        { parameters: ['ddbb7edb-8c53-4586-9844-769e1c830719', {}], return: Promise.resolve(badRequest) },
      ]);

      const { model, httpError, actions } = createModelResource({ updateClient });

      expect(model.value).toBeUndefined();
      expect(httpError.value).toBeUndefined();

      expect(await actions.updateModel('ddbb7edb-8c53-4586-9844-769e1c830719', {})).toBe(false);

      expect(model.value).toBeUndefined();
      expect(httpError.value).toEqual(badRequest);

      expect(updateClientMocks.length).toBe(0);
    });

    test('success', async () => {
      const modelResponse: ModelResponse = {
        id: 'ddbb7edb-8c53-4586-9844-769e1c830719',
        createdAt: '2022-06-12T20:08:24.793Z',
        _links: {},
      };

      const [updateClient, updateClientMocks] = useFunctionMock<UpdateClient<ModelRequest, ModelResponse>>([
        { parameters: ['ddbb7edb-8c53-4586-9844-769e1c830719', {}], return: Promise.resolve(modelResponse) },
      ]);

      const { model, httpError, actions } = createModelResource({ updateClient });

      expect(model.value).toBeUndefined();
      expect(httpError.value).toBeUndefined();

      expect(await actions.updateModel('ddbb7edb-8c53-4586-9844-769e1c830719', {})).toBe(true);

      expect(model.value).toEqual(modelResponse);
      expect(httpError.value).toBeUndefined();

      expect(updateClientMocks.length).toBe(0);
    });
  });

  describe('delete', () => {
    test('missing client', async () => {
      const { actions } = createModelResource({});

      try {
        await actions.deleteModel('ddbb7edb-8c53-4586-9844-769e1c830719');
        throw new Error('expect failed');
      } catch (e) {
        expect(e).toMatchInlineSnapshot('[Error: Missing deleteClient]');
      }
    });

    test('error', async () => {
      const badRequest = new BadRequest({ title: 'bad request' });

      const [deleteClient, deleteClientMocks] = useFunctionMock<DeleteClient>([
        { parameters: ['ddbb7edb-8c53-4586-9844-769e1c830719'], return: Promise.resolve(badRequest) },
      ]);

      const { model, httpError, actions } = createModelResource({ deleteClient });

      expect(model.value).toBeUndefined();
      expect(httpError.value).toBeUndefined();

      expect(await actions.deleteModel('ddbb7edb-8c53-4586-9844-769e1c830719')).toBe(false);

      expect(model.value).toBeUndefined();
      expect(httpError.value).toEqual(badRequest);

      expect(deleteClientMocks.length).toBe(0);
    });

    test('success', async () => {
      const [deleteClient, deleteClientMocks] = useFunctionMock<DeleteClient>([
        { parameters: ['ddbb7edb-8c53-4586-9844-769e1c830719'], return: Promise.resolve(undefined) },
      ]);

      const { model, httpError, actions } = createModelResource({ deleteClient });

      expect(model.value).toBeUndefined();
      expect(httpError.value).toBeUndefined();

      expect(await actions.deleteModel('ddbb7edb-8c53-4586-9844-769e1c830719')).toBe(true);

      expect(model.value).toBeUndefined();
      expect(httpError.value).toBeUndefined();

      expect(deleteClientMocks.length).toBe(0);
    });
  });
});
