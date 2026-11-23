import { computed, defineComponent } from 'vue';
import { useRoute } from 'vue-router';
import { useQuery } from '@tanstack/vue-query';
import { Loading } from '../../partial/loading';
import { Breadcrumb, PageHeader } from '../../heading';
import { AnchorButton } from '../../button';
import { Card, CardBody, CardFooter, Meta } from '../../card';
import { BackToList } from '../../partial/back-to-list';
import { labelClasses } from '../../form/form';
import { readPetClient } from '../../../client/pet';
import type { PetResponse } from '../../../model/pet';
import type { HttpError } from '../../../client/error';
import { provideReadQueryFn } from '../../../hook/use-query';
import { useDocumentTitle } from '../../../hook/use-document-title';
import { usePageError } from '../../../hook/use-page-error';

const pageTitle = 'Pet';

// styled like the (read only) form inputs: 44px for name and tag, 40px for vaccinations
const valueClasses = 'm-0 flex items-center rounded-lg border border-line bg-surface-muted px-3 break-all';

const PetRead = defineComponent(
  () => {
    const route = useRoute();
    const id = route.params.id as string;

    const petQuery = useQuery<PetResponse, HttpError>({
      queryKey: ['pets', id],
      queryFn: provideReadQueryFn(readPetClient, id),
      retry: false,
    });

    const title = computed(() => (petQuery.data.value ? petQuery.data.value.name : pageTitle));

    useDocumentTitle(title);
    usePageError(petQuery.error);

    return () => {
      if (petQuery.isLoading.value) {
        return <Loading />;
      }

      const pet = petQuery.data.value;

      return (
        <div data-testid="page-pet-read" class="flex flex-col gap-[22px]">
          <Breadcrumb items={[{ label: 'Pets', to: '/pet' }, { label: title.value }]} />
          <PageHeader title={title.value} v-slots={{ action: () => (pet ? null : <BackToList to="/pet" />) }} />
          {pet ? (
            <Card aria-label="Pet details">
              <CardBody>
                <dl class="m-0 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div class="flex flex-col gap-1.5">
                    <dt class={labelClasses}>Name</dt>
                    <dd class={`${valueClasses} min-h-11`}>{pet.name}</dd>
                  </div>
                  <div class="flex flex-col gap-1.5">
                    <dt class={labelClasses}>Tag</dt>
                    <dd class={`${valueClasses} min-h-11`}>{pet.tag}</dd>
                  </div>
                </dl>
                <div class="flex flex-col gap-2">
                  <div class="flex min-h-[34px] items-center">
                    <h2 id="pet-vaccinations" class={`m-0 ${labelClasses}`}>
                      Vaccinations <span class="text-fg-muted font-normal">({pet.vaccinations.length})</span>
                    </h2>
                  </div>
                  {pet.vaccinations.length > 0 ? (
                    <ol aria-labelledby="pet-vaccinations" class="m-0 flex list-none flex-col gap-2 p-0">
                      {pet.vaccinations.map((vaccination, i) => (
                        <li key={i} class={`${valueClasses} min-h-10`}>
                          {vaccination.name}
                        </li>
                      ))}
                    </ol>
                  ) : (
                    <p class="border-line-strong text-fg-muted m-0 rounded-lg border border-dashed p-4 text-center text-sm">
                      No vaccinations recorded.
                    </p>
                  )}
                </div>
              </CardBody>
              <CardFooter>
                <Meta id={pet.id} createdAt={pet.createdAt} updatedAt={pet.updatedAt} />
                <span class="flex-1" />
                <BackToList to="/pet" />
                {pet._links?.update ? (
                  <AnchorButton data-testid="pet-update" to={`/pet/${pet.id}/update`} variant="primary">
                    Edit
                  </AnchorButton>
                ) : null}
              </CardFooter>
            </Card>
          ) : null}
        </div>
      );
    };
  },
  {
    name: 'PetRead',
  },
);

export default PetRead;
