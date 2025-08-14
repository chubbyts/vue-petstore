import { computed, defineComponent, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { H1 } from '../../heading';
import { HttpError as HttpErrorPartial } from '../../partial/http-error';
import { readPetClient, updatePetClient } from '../../../client/pet';
import type { PetRequest, PetResponse } from '../../../model/pet';
import { PetForm } from '../../form/pet-form';
import { AnchorButton } from '../../button';
import type { HttpError } from '../../../client/error';
import { provideReadQueryFn, provideUpdateMutationFn } from '../../../hook/use-query';

const pageTitle = 'Pet Update';

const PetUpdate = defineComponent(
  () => {
    const { push } = useRouter();
    const route = useRoute();
    const id = route.params.id as string;

    const queryClient = useQueryClient();

    const petQuery = useQuery<PetResponse, HttpError>({
      queryKey: ['pets', id],
      queryFn: provideReadQueryFn(readPetClient, id),
      retry: false,
    });

    const petMutation = useMutation<PetResponse, HttpError, [string, PetRequest]>({
      mutationFn: provideUpdateMutationFn(updatePetClient),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['pets', id] });
        push('/pet');
      },
      retry: false,
    });

    const submitPet = async (petRequest: PetRequest) => {
      petMutation.mutate([id, petRequest]);
    };

    onMounted(() => {
      // eslint-disable-next-line functional/immutable-data
      document.title = pageTitle;
    });

    const error = computed(() => petMutation.error?.value ?? petQuery.error?.value);

    return () => (
      <>
        {petQuery.data.value || petQuery.error.value ? (
          <div data-testid="page-pet-update">
            {error.value ? <HttpErrorPartial httpError={error.value} /> : null}
            <H1>{pageTitle}</H1>
            {petQuery.data.value ? (
              <PetForm
                httpError={petMutation.error.value ?? undefined}
                initialPet={{ ...petQuery.data.value }}
                submitPet={submitPet}
              />
            ) : null}
            <AnchorButton to="/pet" colorTheme="gray">
              List
            </AnchorButton>
          </div>
        ) : null}
      </>
    );
  },
  {
    name: 'PetUpdate',
  },
);

export default PetUpdate;
