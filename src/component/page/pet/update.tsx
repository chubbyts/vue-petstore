import { computed, defineComponent } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { Loading } from '../../partial/loading';
import { BackToList } from '../../partial/back-to-list';
import { PetForm } from '../../form/pet-form';
import { Breadcrumb, PageHeader } from '../../heading';
import { Meta } from '../../card';
import type { PetRequest, PetResponse } from '../../../model/pet';
import { readPetClient, updatePetClient } from '../../../client/pet';
import type { HttpError } from '../../../client/error';
import { provideReadQueryFn, provideUpdateMutationFn } from '../../../hook/use-query';
import { useToast } from '../../../hook/use-toast';
import { useDocumentTitle } from '../../../hook/use-document-title';
import { usePageError } from '../../../hook/use-page-error';

const pageTitle = 'Edit pet';

const PetUpdate = defineComponent(
  () => {
    const { push } = useRouter();
    const route = useRoute();
    const id = route.params.id as string;

    const queryClient = useQueryClient();
    const showToast = useToast();

    const petQuery = useQuery<PetResponse, HttpError>({
      queryKey: ['pets', id],
      queryFn: provideReadQueryFn(readPetClient, id),
      retry: false,
    });

    const petMutation = useMutation<PetResponse, HttpError, [string, PetRequest]>({
      mutationFn: provideUpdateMutationFn(updatePetClient),
      onSuccess: (pet) => {
        showToast(`Saved “${pet.name}” — 200 OK`);
        queryClient.setQueryData(['pets', id], pet);
        void queryClient.invalidateQueries({ queryKey: ['pets'] });
        void push(`/pet/${id}`);
      },
      retry: false,
    });

    const submitPet = (petRequest: PetRequest): void => {
      petMutation.mutate([id, petRequest]);
    };

    const title = computed(() => (petQuery.data.value ? `Edit ${petQuery.data.value.name}` : pageTitle));

    useDocumentTitle(title);
    usePageError(() => petMutation.error.value ?? petQuery.error.value, {
      focus: () => Boolean(petMutation.error.value),
    });

    return () => {
      if (petQuery.isLoading.value) {
        return <Loading />;
      }

      const pet = petQuery.data.value;

      return (
        <div data-testid="page-pet-update" class="flex flex-col gap-[22px]">
          <Breadcrumb
            items={[
              { label: 'Pets', to: '/pet' },
              ...(pet ? [{ label: pet.name, to: `/pet/${id}` }] : []),
              { label: 'Edit' },
            ]}
          />
          <PageHeader title={title.value} v-slots={{ action: () => (pet ? null : <BackToList to="/pet" />) }} />
          {pet ? (
            <PetForm
              httpError={petMutation.error.value ?? undefined}
              initialPet={pet}
              submitPet={submitPet}
              submitLabel="Save changes"
              cancelTo={`/pet/${id}`}
              listTo="/pet"
              meta={() => <Meta id={pet.id} createdAt={pet.createdAt} updatedAt={pet.updatedAt} />}
              isPending={petMutation.isPending.value}
            />
          ) : null}
        </div>
      );
    };
  },
  {
    name: 'PetUpdate',
  },
);

export default PetUpdate;
