import { HttpError } from '../client/error';
import type { ModelListRequest, ModelListResponse, ModelRequest, ModelResponse } from '../model/model';
import type { CreateClient, DeleteClient, ListClient, ReadClient, UpdateClient } from '../client/client';
import { ref } from 'vue';

export const createModelResource = <
  MLReq extends ModelListRequest,
  MLRes extends ModelListResponse,
  MReq extends ModelRequest,
  MRes extends ModelResponse,
>({
  listClient,
  createClient,
  readClient,
  updateClient,
  deleteClient,
}: {
  listClient?: ListClient<MLReq, MLRes>;
  createClient?: CreateClient<MReq, MRes>;
  readClient?: ReadClient<MRes>;
  updateClient?: UpdateClient<MReq, MRes>;
  deleteClient?: DeleteClient;
}) => {
  const loading = ref<'list' | 'create' | 'read' | 'update' | 'delete' | undefined>();
  const modelList = ref<MLRes | undefined>();
  const model = ref<MRes | undefined>();
  const httpError = ref<HttpError | undefined>();

  const listModel = async (req: MLReq): Promise<boolean> => {
    if (!listClient) {
      throw new Error('Missing listClient');
    }

    loading.value = 'list';

    const response = await listClient(req);

    let success: boolean;

    if (response instanceof HttpError) {
      httpError.value = response;
      success = false;
    } else {
      httpError.value = undefined;
      modelList.value = response;
      success = true;
    }

    loading.value = undefined;

    return success;
  };

  const createModel = async (req: MReq): Promise<boolean> => {
    if (!createClient) {
      throw new Error('Missing createClient');
    }

    loading.value = 'create';

    const response = await createClient(req);

    let success: boolean;

    if (response instanceof HttpError) {
      httpError.value = response;
      success = false;
    } else {
      httpError.value = undefined;
      model.value = response;
      success = true;
    }

    loading.value = undefined;

    return success;
  };

  const readModel = async (id: string): Promise<boolean> => {
    if (!readClient) {
      throw new Error('Missing readClient');
    }

    loading.value = 'read';

    const response = await readClient(id);

    let success: boolean;

    if (response instanceof HttpError) {
      httpError.value = response;
      success = false;
    } else {
      httpError.value = undefined;
      model.value = response;
      success = true;
    }

    loading.value = undefined;

    return success;
  };

  const updateModel = async (id: string, req: MReq): Promise<boolean> => {
    if (!updateClient) {
      throw new Error('Missing updateClient');
    }

    loading.value = 'update';

    const response = await updateClient(id, req);

    let success: boolean;

    if (response instanceof HttpError) {
      httpError.value = response;
      success = false;
    } else {
      httpError.value = undefined;
      model.value = response;
      success = true;
    }

    loading.value = undefined;

    return success;
  };

  const deleteModel = async (id: string): Promise<boolean> => {
    if (!deleteClient) {
      throw new Error('Missing deleteClient');
    }

    loading.value = 'delete';

    const response = await deleteClient(id);

    let success: boolean;

    if (response instanceof HttpError) {
      httpError.value = response;
      success = false;
    } else {
      httpError.value = undefined;
      model.value = undefined;
      success = true;
    }

    loading.value = undefined;

    return success;
  };

  return {
    loading,
    modelList,
    model,
    httpError,
    actions: { listModel, createModel, readModel, updateModel, deleteModel },
  };
};
