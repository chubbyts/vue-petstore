import { defineComponent, onMounted, onUnmounted } from 'vue';
import { H1 } from '../../heading';
import { HttpError as HttpErrorPartial } from '../../partial/http-error';
import { useRoute, useRouter } from 'vue-router';
import { createModelResource } from '../../../hook/create-model-resource';
import { readPetClient as readClient, updatePetClient as updateClient } from '../../../client/pet';
import type { PetRequest } from '../../../model/pet';
import { PetForm } from '../../form/pet-form';
import { AnchorButton } from '../../button';

const pageTitle = 'Pet Update';

const PetUpdate = defineComponent(
  () => {
    const { push } = useRouter();
    const route = useRoute();
    const id = route.params.id as string;

    const { model: pet, httpError, actions } = createModelResource({ readClient, updateClient });

    const submitPet = async (petRequest: PetRequest) => {
      if (await actions.updateModel(id, petRequest)) {
        push('/pet');
      }
    };

    onMounted(() => {
      document.title = pageTitle;

      actions.readModel(id);
    });

    onUnmounted(() => {
      document.title = '';
    });

    return () => (
      <>
        {pet.value || httpError.value ? (
          <div data-testid="page-pet-update">
            {httpError.value ? <HttpErrorPartial httpError={httpError.value} /> : null}
            <H1>{pageTitle}</H1>
            {pet.value ? <PetForm httpError={httpError.value} initialPet={pet.value} submitPet={submitPet} /> : null}
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
