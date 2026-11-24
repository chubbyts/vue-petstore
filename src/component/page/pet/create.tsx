import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';
import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { PetForm } from '../../form/pet-form';
import type { PetRequest, PetResponse } from '../../../model/pet';
import { Breadcrumb, PageHeader } from '../../heading';
import { createPetClient } from '../../../client/pet';
import type { HttpError } from '../../../client/error';
import { provideCreateMutationFn } from '../../../hook/use-query';
import { useToast } from '../../../hook/use-toast';
import { useDocumentTitle } from '../../../hook/use-document-title';
import { usePageError } from '../../../hook/use-page-error';

const pageTitle = 'New pet';

const PetCreate = defineComponent(
  () => {
    const { push } = useRouter();
    const queryClient = useQueryClient();
    const showToast = useToast();

    const petMutation = useMutation<PetResponse, HttpError, PetRequest>({
      mutationFn: provideCreateMutationFn(createPetClient),
      onSuccess: (pet) => {
        showToast(`Created “${pet.name}” — 201 Created`);
        void queryClient.invalidateQueries({ queryKey: ['pets'] });
        void push(`/pet/${pet.id}`);
      },
      retry: false,
    });

    const submitPet = (petRequest: PetRequest): void => {
      petMutation.mutate(petRequest);
    };

    useDocumentTitle(pageTitle);
    usePageError(petMutation.error, { focus: true });

    return () => (
      <div data-testid="page-pet-create" class="flex flex-col gap-[22px]">
        <Breadcrumb items={[{ label: 'Pets', to: '/pet' }, { label: 'New' }]} />
        <PageHeader title={pageTitle} />
        <PetForm
          httpError={petMutation.error.value ?? undefined}
          submitPet={submitPet}
          submitLabel="Create pet"
          cancelTo="/pet"
          listTo="/pet"
          isPending={petMutation.isPending.value}
        />
      </div>
    );
  },
  {
    name: 'PetCreate',
  },
);

export default PetCreate;
