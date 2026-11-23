import { defineComponent } from 'vue';
import { PageHeader } from '../heading';
import { PawIcon } from '../icon';
import { ModelCard } from '../partial/model-card';
import { usePetCountQuery } from '../../hook/use-pet-count-query';
import { useDocumentTitle } from '../../hook/use-document-title';
import { usePageError } from '../../hook/use-page-error';

const pageTitle = 'Home';

const Home = defineComponent(
  () => {
    const petCountQuery = usePetCountQuery();

    useDocumentTitle(pageTitle);
    usePageError(petCountQuery.error);

    return () => (
      <div data-testid="page-home" class="flex flex-col gap-[22px]">
        <PageHeader eyebrow="Petstore / Admin" title={pageTitle} />
        <section aria-label="Resources" class="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
          <ModelCard
            data-testid="model-card-pet"
            icon={() => <PawIcon size={20} />}
            title="Pets"
            description="Pets with their tag and vaccinations."
            count={petCountQuery.data.value?.count}
            countLabel={(count: number) => (count === 1 ? 'pet' : 'pets')}
            listTo="/pet"
            createTo={petCountQuery.data.value?._links?.create ? '/pet/create' : undefined}
            createLabel="New pet"
          />
        </section>
      </div>
    );
  },
  {
    name: 'Home',
  },
);

export default Home;
