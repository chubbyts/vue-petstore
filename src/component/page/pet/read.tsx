import { defineComponent, onMounted } from 'vue';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { useRoute } from 'vue-router';
import { useQuery } from '@tanstack/vue-query';
import { HttpError as HttpErrorPartial } from '../../partial/http-error';
import { H1 } from '../../heading';
import { readPetClient } from '../../../client/pet';
import { AnchorButton } from '../../button';
import type { PetResponse } from '../../../model/pet';
import type { HttpError } from '../../../client/error';
import { provideReadQueryFn } from '../../../hook/use-query';

const pageTitle = 'Pet Read';

const PetRead = defineComponent(
  () => {
    const route = useRoute();
    const id = route.params.id as string;

    const petQuery = useQuery<PetResponse, HttpError>({
      queryKey: ['pets', id],
      queryFn: provideReadQueryFn(readPetClient, id),
      retry: false,
    });

    onMounted(() => {
      // eslint-disable-next-line functional/immutable-data
      document.title = pageTitle;
    });

    return () => (
      <>
        {petQuery.data.value || petQuery.error.value ? (
          <div data-testid="page-pet-read">
            {petQuery.error.value ? <HttpErrorPartial httpError={petQuery.error.value} /> : null}
            <H1>{pageTitle}</H1>
            {petQuery.data.value ? (
              <div>
                <dl>
                  <dt class="font-bold">Id</dt>
                  <dd class="mb-4">{petQuery.data.value.id}</dd>
                  <dt class="font-bold">CreatedAt</dt>
                  <dd class="mb-4">
                    {format(Date.parse(petQuery.data.value.createdAt), 'dd.MM.yyyy - HH:mm:ss', { locale: de })}
                  </dd>
                  <dt class="font-bold">UpdatedAt</dt>
                  <dd class="mb-4">
                    {petQuery.data.value.updatedAt
                      ? format(Date.parse(petQuery.data.value.updatedAt), 'dd.MM.yyyy - HH:mm:ss', { locale: de })
                      : null}
                  </dd>
                  <dt class="font-bold">Name</dt>
                  <dd class="mb-4">{petQuery.data.value.name}</dd>
                  <dt class="font-bold">Tag</dt>
                  <dd class="mb-4">{petQuery.data.value.tag}</dd>
                  <dt class="font-bold">Vaccinations</dt>
                  <dd class="mb-4">
                    {petQuery.data.value.vaccinations.length > 0 ? (
                      <ul>
                        {petQuery.data.value.vaccinations.map((vaccination) => (
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
