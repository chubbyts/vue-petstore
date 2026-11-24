import { computed, defineComponent, shallowRef, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import qs from 'qs';
import { z } from 'zod';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { Loading } from '../../partial/loading';
import { DeleteDialog } from '../../partial/delete-dialog';
import { Pagination } from '../../partial/pagination';
import { PetFiltersForm } from '../../form/pet-filters-form';
import { PageHeader } from '../../heading';
import { AnchorButton, Button } from '../../button';
import { Card } from '../../card';
import { Link } from '../../link';
import { Table, Tbody, Td, Th, Thead, Tr } from '../../table';
import { EyeIcon, PencilIcon, PlusIcon, TrashIcon } from '../../icon';
import { numberSchema } from '../../../model/model';
import type { PetListRequest, PetSort, PetFilters, PetResponse, PetListResponse } from '../../../model/pet';
import { petFiltersSchema, petSortSchema } from '../../../model/pet';
import { deletePetClient, listPetsClient } from '../../../client/pet';
import type { HttpError } from '../../../client/error';
import { provideDeleteMutationFn, provideListQueryFn } from '../../../hook/use-query';
import { useToast } from '../../../hook/use-toast';
import { DateTime } from '../../date-time';
import { useDocumentTitle } from '../../../hook/use-document-title';
import { usePageError } from '../../../hook/use-page-error';

const pageTitle = 'Pets';

const limit = 10;

const visibleVaccinations = 2;

const querySchema = z.object({
  page: numberSchema.optional().default(1),
  filters: petFiltersSchema.optional().default({}),
  sort: petSortSchema.optional().default({}),
});

// Default → Name A–Z → Name Z–A → Default
const nextSortName = (name: PetSort['name']): PetSort['name'] => {
  if (name === 'asc') {
    return 'desc';
  }

  if (name === 'desc') {
    return undefined;
  }

  return 'asc';
};

const PetList = defineComponent(
  () => {
    const { push, replace } = useRouter();
    const route = useRoute();
    const query = computed(() => querySchema.parse(qs.parse(route.fullPath.substring(route.path.length + 1))));
    const queryClient = useQueryClient();
    const showToast = useToast();

    const petToDelete = shallowRef<PetResponse | undefined>(undefined);

    // a delete finishing late (dialog cancelled meanwhile) must not close the dialog opened for another pet
    const closeDeleteDialogOf = (pet: PetResponse): void => {
      if (petToDelete.value?.id === pet.id) {
        // oxlint-disable-next-line functional/immutable-data
        petToDelete.value = undefined;
      }
    };

    const petListRequest = computed<PetListRequest>(() => ({
      offset: query.value.page * limit - limit,
      limit,
      filters: query.value.filters,
      sort: query.value.sort,
    }));

    const petListQuery = useQuery<PetListResponse, HttpError>(() => ({
      queryKey: ['pets', qs.stringify(petListRequest.value)],
      queryFn: provideListQueryFn(listPetsClient, petListRequest.value),
      // keep showing the current page while the next one loads: no flicker and the pagination keeps the focus
      placeholderData: keepPreviousData,
      retry: false,
    }));

    const petDeleteMutation = useMutation<unknown, HttpError, PetResponse>({
      mutationFn: (pet: PetResponse) => provideDeleteMutationFn(deletePetClient)(pet.id),
      // closes the dialog once the list is refetched: the row (and its delete button) is gone by then,
      // so the dialog moves the focus to the main content instead of an element about to be removed
      onSuccess: async (_, pet) => {
        await queryClient.invalidateQueries({ queryKey: ['pets'] });
        closeDeleteDialogOf(pet);
        showToast(`Deleted “${pet.name}” — 204 No Content`);
      },
      onError: (_, pet) => {
        closeDeleteDialogOf(pet);
      },
      retry: false,
    });

    // refining a filter (e.g. "re" → "rex" while typing) replaces the history entry: back returns to the list
    // before the filtering, not keystroke by keystroke
    const submitPetFilters = (filters: PetFilters): void => {
      const url = `/pet?${qs.stringify({ ...query.value, page: 1, filters })}`;

      void (query.value.filters.name && filters.name ? replace(url) : push(url));
    };

    const submitPetSort = (sort: PetSort): void => {
      void push(`/pet?${qs.stringify({ ...query.value, page: 1, sort })}`);
    };

    const toggleSort = (): void => {
      submitPetSort({ ...query.value.sort, name: nextSortName(query.value.sort.name) });
    };

    // past the last page (e.g. its last pet got deleted, or an outdated link): go to the last page
    // not from placeholder data: that's the response of another query (e.g. other filters, after back)
    // the limit of the response: the server may cap the requested one, like the pagination does
    const lastPage = computed(() =>
      petListQuery.data.value && !petListQuery.isPlaceholderData.value
        ? Math.max(1, Math.ceil(petListQuery.data.value.count / petListQuery.data.value.limit))
        : undefined,
    );

    watch(
      [lastPage, query],
      ([currentLastPage, currentQuery]) => {
        if (currentLastPage !== undefined && currentQuery.page > currentLastPage) {
          void replace(`/pet?${qs.stringify({ ...currentQuery, page: currentLastPage })}`);
        }
      },
      { immediate: true },
    );

    useDocumentTitle(pageTitle);
    usePageError(() => petDeleteMutation.error.value ?? petListQuery.error.value, {
      focus: () => Boolean(petDeleteMutation.error.value),
    });

    return () => {
      if (petListQuery.isLoading.value) {
        return <Loading />;
      }

      const data = petListQuery.data.value;

      // a page past the end (also as placeholder while the last page loads) has nothing to show: no bogus range
      const isPastEnd = data !== undefined && data.count > 0 && data.offset >= data.count;

      return (
        <div data-testid="page-pet-list" class="flex flex-col gap-[22px]">
          <PageHeader
            eyebrow="Resources / Pets"
            title={pageTitle}
            v-slots={{
              action: () =>
                data?._links?.create ? (
                  <AnchorButton data-testid="pet-create" to="/pet/create" variant="primary">
                    <PlusIcon strokeWidth={2.2} />
                    New pet
                  </AnchorButton>
                ) : null,
            }}
          />
          <Card aria-label="Pet list" aria-busy={petListQuery.isFetching.value || undefined} class="overflow-hidden">
            {/* outside the data check: stays (with the typing and its focus) if the filter gets rejected */}
            <div class="border-line flex flex-wrap items-center gap-3 border-b px-4 py-3.5">
              <PetFiltersForm
                httpError={petListQuery.error.value ?? undefined}
                initialPetFilters={query.value.filters}
                submitPetFilters={submitPetFilters}
              />
            </div>

            {data && !isPastEnd ? (
              <>
                <Table stackOnNarrow class="min-w-[1120px]">
                  <caption class="sr-only">Pets</caption>
                  <Thead>
                    <Tr>
                      <Th onSort={toggleSort} sort={query.value.sort.name ?? undefined}>
                        Name
                      </Th>
                      <Th>Tag</Th>
                      <Th>Vaccinations</Th>
                      <Th shrink>ID</Th>
                      <Th shrink>Created</Th>
                      <Th shrink>Updated</Th>
                      <Th align="right">Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {data.items.map((pet: PetResponse, i) => (
                      <Tr key={pet.id}>
                        <Td>
                          {pet._links?.read ? (
                            <Link
                              to={`/pet/${pet.id}`}
                              class="text-fg hover:text-link font-semibold no-underline hover:underline"
                            >
                              {pet.name}
                            </Link>
                          ) : (
                            <span class="font-semibold">{pet.name}</span>
                          )}
                        </Td>
                        <Td label="Tag">
                          {pet.tag ? (
                            <span class="bg-line text-fg-secondary inline-block rounded-full px-2 py-0.5 text-[13px] font-medium">
                              {pet.tag}
                            </span>
                          ) : null}
                        </Td>
                        <Td label="Vaccinations">
                          {pet.vaccinations.length > 0 ? (
                            <div class="flex flex-wrap items-center gap-1.5">
                              {pet.vaccinations.slice(0, visibleVaccinations).map((vaccination, y) => (
                                <span
                                  key={y}
                                  class="border-chip-line bg-chip text-chip-fg rounded-md border px-2 py-0.5 text-[13px]"
                                >
                                  {vaccination.name}
                                </span>
                              ))}
                              {pet.vaccinations.length > visibleVaccinations ? (
                                <span class="text-fg-muted text-[13px]">
                                  <span aria-hidden="true">+{pet.vaccinations.length - visibleVaccinations}</span>
                                  <span class="sr-only">and {pet.vaccinations.length - visibleVaccinations} more</span>
                                </span>
                              ) : null}
                            </div>
                          ) : null}
                        </Td>
                        <Td label="ID" nowrap class="text-fg-placeholder text-[13px]">
                          {pet.id}
                        </Td>
                        <Td label="Created" nowrap class="text-fg-placeholder text-[13px]">
                          <DateTime value={pet.createdAt} />
                        </Td>
                        <Td label="Updated" nowrap class="text-fg-placeholder text-[13px]">
                          {pet.updatedAt ? <DateTime value={pet.updatedAt} /> : null}
                        </Td>
                        {/* stacked: the text of the first action aligned with the labels */}
                        <Td align="right" compact nowrap class="@max-3xl:-ml-3">
                          {pet._links?.read ? (
                            <AnchorButton
                              data-testid={`read-pet-${i}`}
                              to={`/pet/${pet.id}`}
                              variant="ghost"
                              size="sm"
                              aria-label={`View ${pet.name}`}
                            >
                              <EyeIcon />
                              View
                            </AnchorButton>
                          ) : null}
                          {pet._links?.update ? (
                            <AnchorButton
                              data-testid={`update-pet-${i}`}
                              to={`/pet/${pet.id}/update`}
                              variant="ghost"
                              size="sm"
                              aria-label={`Edit ${pet.name}`}
                            >
                              <PencilIcon />
                              Edit
                            </AnchorButton>
                          ) : null}
                          {pet._links?.delete ? (
                            <Button
                              data-testid={`remove-pet-${i}`}
                              variant="ghost-danger"
                              size="sm"
                              aria-label={`Delete ${pet.name}`}
                              // oxlint-disable-next-line functional/immutable-data
                              onClick={() => (petToDelete.value = pet)}
                            >
                              <TrashIcon />
                              Delete
                            </Button>
                          ) : null}
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
                {data.items.length === 0 ? (
                  <div class="text-fg-muted flex flex-col items-center gap-2.5 px-4 py-12">
                    {query.value.filters.name ? (
                      <>
                        <strong class="text-fg">No pets match “{query.value.filters.name}”</strong>
                        <Button
                          data-testid="pet-filters-clear"
                          variant="secondary"
                          size="sm"
                          onClick={() => submitPetFilters({ ...query.value.filters, name: undefined })}
                        >
                          Clear filter
                        </Button>
                      </>
                    ) : (
                      <strong class="text-fg">No pets yet</strong>
                    )}
                  </div>
                ) : null}

                <Pagination
                  offset={data.offset}
                  limit={data.limit}
                  count={data.count}
                  pageTo={(page: number) => `/pet?${qs.stringify({ ...query.value, page })}`}
                />
              </>
            ) : null}
          </Card>
          {petToDelete.value ? (
            <DeleteDialog
              name={petToDelete.value.name}
              isPending={petDeleteMutation.isPending.value}
              // oxlint-disable-next-line functional/immutable-data
              onCancel={() => (petToDelete.value = undefined)}
              onConfirm={() => petToDelete.value && petDeleteMutation.mutate(petToDelete.value)}
            />
          ) : null}
        </div>
      );
    };
  },
  {
    name: 'PetList',
  },
);

export default PetList;
