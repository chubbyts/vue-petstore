import { computed, defineComponent, onMounted } from 'vue';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { useRoute, useRouter } from 'vue-router';
import { z } from 'zod';
import qs from 'qs';
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { H1 } from '../../heading';
import { HttpError as HttpErrorPartial } from '../../partial/http-error';
import { deletePetClient, listPetsClient } from '../../../client/pet';
import { numberSchema } from '../../../model/model';
import type { PetFilters, PetListResponse, PetSort } from '../../../model/pet';
import { petFiltersSchema, petSortSchema } from '../../../model/pet';
import { AnchorButton, Button } from '../../button';
import { Table, Tbody, Td, Th, Thead, Tr } from '../../table';
import { Pagination } from '../../partial/pagination';
import { PetFiltersForm } from '../../form/pet-filters-form';
import type { HttpError } from '../../../client/error';
import { provideDeleteMutationFn, provideListQueryFn } from '../../../hook/use-query';

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

    const queryClient = useQueryClient();

    const petListRequest = computed(() => ({
      offset: query.value.page * limit - limit,
      limit,
      filters: query.value.filters,
      sort: query.value.sort,
    }));

    const queryKey = computed(() => ['pets', qs.stringify(petListRequest.value)]);

    const queryFn = computed(() => provideListQueryFn(listPetsClient, petListRequest.value));

    const petListQuery = useQuery<PetListResponse, HttpError>({
      queryKey,
      queryFn,
      retry: false,
    });

    const petDeleteMutation = useMutation<unknown, HttpError, string>({
      mutationFn: provideDeleteMutationFn(deletePetClient),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKey.value });
      },
      retry: false,
    });

    const deletePet = async (id: string) => {
      petDeleteMutation.mutate(id);
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
      // eslint-disable-next-line functional/immutable-data
      document.title = pageTitle;
    });

    const error = computed(() => petDeleteMutation.error?.value ?? petListQuery.error?.value);

    return () => (
      <>
        {petListQuery.data.value || petListQuery.error.value ? (
          <div data-testid="page-pet-list">
            {error.value ? <HttpErrorPartial httpError={error.value} /> : null}
            <H1>{pageTitle}</H1>
            {petListQuery.data.value ? (
              <div>
                {petListQuery.data.value._links?.create ? (
                  <AnchorButton to="/pet/create" colorTheme="green" class="mb-4">
                    Create
                  </AnchorButton>
                ) : null}
                <PetFiltersForm
                  httpError={petListQuery.error.value ?? undefined}
                  initialPetFilters={{ ...query.value.filters }}
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
                      {petListQuery.data.value.items.map((pet, i) => (
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
                    totalPages={Math.ceil(petListQuery.data.value.count / petListQuery.data.value.limit)}
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
