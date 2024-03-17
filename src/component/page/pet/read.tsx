import { defineComponent, onMounted, onUnmounted } from 'vue';
import { H1 } from '../../heading';
import { HttpError as HttpErrorPartial } from '../../partial/http-error';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { useRoute } from 'vue-router';
import { createModelResource } from '../../../hook/create-model-resource';
import { readPetClient as readClient } from '../../../client/pet';
import { AnchorButton } from '../../button';

const pageTitle = 'Pet Read';

const PetRead = defineComponent(
  () => {
    const route = useRoute();
    const id = route.params.id as string;

    const { model: pet, httpError, actions } = createModelResource({ readClient });

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
          <div data-testid="page-pet-read">
            {httpError.value ? <HttpErrorPartial httpError={httpError.value} /> : null}
            <H1>{pageTitle}</H1>
            {pet.value ? (
              <div>
                <dl>
                  <dt class="font-bold">Id</dt>
                  <dd class="mb-4">{pet.value.id}</dd>
                  <dt class="font-bold">CreatedAt</dt>
                  <dd class="mb-4">
                    {format(Date.parse(pet.value.createdAt), 'dd.MM.yyyy - HH:mm:ss', { locale: de })}
                  </dd>
                  <dt class="font-bold">UpdatedAt</dt>
                  <dd class="mb-4">
                    {pet.value.updatedAt
                      ? format(Date.parse(pet.value.updatedAt), 'dd.MM.yyyy - HH:mm:ss', { locale: de })
                      : null}
                  </dd>
                  <dt class="font-bold">Name</dt>
                  <dd class="mb-4">{pet.value.name}</dd>
                  <dt class="font-bold">Tag</dt>
                  <dd class="mb-4">{pet.value.tag}</dd>
                  <dt class="font-bold">Vaccinations</dt>
                  <dd class="mb-4">
                    {pet.value.vaccinations.length > 0 ? (
                      <ul>
                        {pet.value.vaccinations.map((vaccination) => (
                          <li key={vaccination.name}>{vaccination.name}</li>
                        ))}
                      </ul>
                    ) : null}
                  </dd>
                </dl>
              </div>
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
    name: 'PetRead',
  },
);

export default PetRead;
