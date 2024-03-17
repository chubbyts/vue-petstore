import { defineComponent, onMounted, onUnmounted } from 'vue';
import { H1 } from '../../heading';
import { HttpError as HttpErrorPartial } from '../../partial/http-error';
import { useRouter } from 'vue-router';
import { createModelResource } from '../../../hook/create-model-resource';
import { createPetClient as createClient } from '../../../client/pet';
import type { PetRequest } from '../../../model/pet';
import { PetForm } from '../../form/pet-form';
import { AnchorButton } from '../../button';

const pageTitle = 'Pet Create';

const PetCreate = defineComponent(
  () => {
    const { push } = useRouter();

    const { httpError, actions } = createModelResource({ createClient });

    const submitPet = async (pet: PetRequest) => {
      if (await actions.createModel(pet)) {
        push('/pet');
      }
    };

    onMounted(() => {
      document.title = pageTitle;
    });

    onUnmounted(() => {
      document.title = '';
    });

    return () => (
      <div data-testid="page-pet-create">
        {httpError.value ? <HttpErrorPartial httpError={httpError.value} /> : null}
        <H1>{pageTitle}</H1>
        <PetForm httpError={httpError.value} submitPet={submitPet} />
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
