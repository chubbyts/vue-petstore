import { defineComponent, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useMutation } from '@tanstack/vue-query';
import { H1 } from '../../heading';
import { HttpError as HttpErrorPartial } from '../../partial/http-error';
import { createPetClient } from '../../../client/pet';
import type { PetRequest, PetResponse } from '../../../model/pet';
import { PetForm } from '../../form/pet-form';
import { AnchorButton } from '../../button';
import type { HttpError } from '../../../client/error';
import { provideCreateMutationFn } from '../../../hook/use-query';

const pageTitle = 'Pet Create';

const PetCreate = defineComponent(
  () => {
    const { push } = useRouter();

    const petMutation = useMutation<PetResponse, HttpError, PetRequest>({
      mutationFn: provideCreateMutationFn(createPetClient),
      onSuccess: () => {
        push('/pet');
      },
      retry: false,
    });

    const submitPet = async (petRequest: PetRequest) => {
      petMutation.mutate(petRequest);
    };

    onMounted(() => {
      // eslint-disable-next-line functional/immutable-data
      document.title = pageTitle;
    });

    return () => (
      <div data-testid="page-pet-create">
        {petMutation.error.value ? <HttpErrorPartial httpError={petMutation.error.value} /> : null}
        <H1>{pageTitle}</H1>
        <PetForm httpError={petMutation.error.value ?? undefined} submitPet={submitPet} />
        <AnchorButton to="/pet" colorTheme="gray">
          List
        </AnchorButton>
      </div>
    );
  },
  {
    name: 'PetCreate',
  },
);

export default PetCreate;
