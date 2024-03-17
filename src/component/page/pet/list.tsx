import { computed, defineComponent, onMounted, onUnmounted, watch } from 'vue';
import { H1 } from '../../heading';
import { HttpError as HttpErrorPartial } from '../../partial/http-error';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { useRoute, useRouter } from 'vue-router';
import { createModelResource } from '../../../hook/create-model-resource';
import { deletePetClient as deleteClient, listPetsClient as listClient } from '../../../client/pet';
import { z } from 'zod';
import { numberSchema } from '../../../model/model';
import type { PetFilters, PetSort } from '../../../model/pet';
import { petFiltersSchema, petSortSchema } from '../../../model/pet';
import qs from 'qs';
import { AnchorButton, Button } from '../../button';
import { Table, Tbody, Td, Th, Thead, Tr } from '../../table';
import { Pagination } from '../../partial/pagination';
import { PetFiltersForm } from '../../form/pet-filters-form';

const pageTitle = 'Pet List';

const limit = 10;

const querySchema = z.object({
  page: numberSchema.optional().default(1),
  filters: petFiltersSchema.optional().default({}),
  sort: petSortSchema.optional().default({}),
});

const PetList = defineComponent(
  () => {
    const { push } = useRouter();
    const route = useRoute();
    const query = computed(() => querySchema.parse(qs.parse(route.fullPath.substring(route.path.length + 1))));

    const {
      modelList: petList,
      httpError,
      actions,
    } = createModelResource({
      listClient,
      deleteClient,
    });

    const petListRequest = computed(() => ({
      offset: query.value.page * limit - limit,
      limit,
      filters: query.value.filters,
      sort: query.value.sort,
    }));

    const fetchPetList = async () => {
      actions.listModel(petListRequest.value);
    };

    const deletePet = async (id: string) => {
      if (await actions.deleteModel(id)) {
        fetchPetList();
      }
    };

    const submitPage = (page: number): void => {
      push(`/pet?${qs.stringify({ ...query.value, page })}`);
    };

    const submitPetFilters = (filters: PetFilters): void => {
      push(`/pet?${qs.stringify({ ...query.value, page: 1, filters })}`);
    };

    const submitPetSort = (sort: PetSort): void => {
      push(`/pet?${qs.stringify({ ...query.value, page: 1, sort })}`);
    };

    onMounted(() => {
      document.title = pageTitle;

      fetchPetList();
    });

    watch(query, () => {
      fetchPetList();
    });

    onUnmounted(() => {
      document.title = '';
    });

    return () => (
      <>
        {petList.value || httpError.value ? (
          <div data-testid="page-pet-list">
            {httpError.value ? <HttpErrorPartial httpError={httpError.value} /> : null}
            <H1>{pageTitle}</H1>
            {petList.value ? (
              <div>
                {petList.value._links?.create ? (
                  <AnchorButton to="/pet/create" colorTheme="green" class="mb-4">
                    Create
                  </AnchorButton>
                ) : null}
                <PetFiltersForm
                  httpError={httpError.value}
                  initialPetFilters={query.value.filters}
                  submitPetFilters={submitPetFilters}
                />
                <div class="mt-4">
                  <Table>
                    <Thead>
                      <Tr>
                        <Th>Id</Th>
                        <Th>CreatedAt</Th>
                        <Th>UpdatedAt</Th>
                        <Th>
                          <span>Name (</span>
                          <button
                            data-testid="pet-sort-name-asc"
                            onClick={() => submitPetSort({ ...query.value.sort, name: 'asc' })}
                          >
                            <span class="mx-1 inline-block">A-Z</span>
                          </button>
                          <span>|</span>
                          <button
                            data-testid="pet-sort-name-desc"
                            onClick={() => submitPetSort({ ...query.value.sort, name: 'desc' })}
                          >
                            <span class="mx-1 inline-block">Z-A</span>
                          </button>
                          <span>|</span>
                          <button
                            data-testid="pet-sort-name--"
                            onClick={() => submitPetSort({ ...query.value.sort, name: undefined })}
                          >
                            <span class="mx-1 inline-block">---</span>
                          </button>
                          <span>)</span>
                        </Th>
                        <Th>Tag</Th>
                        <Th>Actions</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {petList.value.items.map((pet, i) => (
                        <Tr key={pet.id}>
                          <Td>{pet.id}</Td>
                          <Td>{format(Date.parse(pet.createdAt), 'dd.MM.yyyy - HH:mm:ss', { locale: de })}</Td>
                          <Td>
                            {pet.updatedAt &&
                              format(Date.parse(pet.updatedAt), 'dd.MM.yyyy - HH:mm:ss', { locale: de })}
                          </Td>
                          <Td>{pet.name}</Td>
                          <Td>{pet.tag}</Td>
                          <Td>
                            {pet._links?.read ? (
                              <AnchorButton to={`/pet/${pet.id}`} colorTheme="gray" class="mr-4">
                                Read
                              </AnchorButton>
                            ) : null}
                            {pet._links?.update ? (
                              <AnchorButton to={`/pet/${pet.id}/update`} colorTheme="gray" class="mr-4">
                                Update
                              </AnchorButton>
                            ) : null}
                            {pet._links?.delete ? (
                              <Button
                                data-testid={`remove-pet-${i}`}
                                onClick={() => {
                                  deletePet(pet.id);
                                }}
                                colorTheme="red"
                              >
                                Delete
                              </Button>
                            ) : null}
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </div>
                <div class="mt-4">
                  <Pagination
                    currentPage={query.value.page}
                    totalPages={Math.ceil(petList.value.count / petList.value.limit)}
                    maxPages={7}
                    submitPage={submitPage}
                  />
                </div>
              </div>
            ) : null}
          </div>
        ) : null}
      </>
    );
  },
  {
    name: 'PetList',
  },
);

export default PetList;
