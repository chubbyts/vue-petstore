import { computed, defineComponent, reactive } from 'vue';
import type { PetFilters } from '../../model/pet';
import type { HttpError } from '../../client/error';
import { createInvalidParametersByName } from '../../client/error';
import { Button } from '../button';
import { FieldSet, TextField } from './form';

export const PetFiltersForm = defineComponent(
  (props: {
    httpError: HttpError | undefined;
    initialPetFilters: PetFilters;
    submitPetFilters: (petFilters: PetFilters) => void;
  }) => {
    const groupInvalidParametersByName = computed(() => createInvalidParametersByName(props.httpError));

    const petFilters = reactive<PetFilters>(props.initialPetFilters);

    const onSubmit = () => {
      props.submitPetFilters({ ...petFilters });
    };

    return () => (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onSubmit();
        }}
      >
        <FieldSet>
          <TextField
            dataTestId="pet-filters-form-name"
            label="Name"
            value={petFilters.name ?? ''}
            // eslint-disable-next-line functional/immutable-data
            setValue={(value) => (petFilters.name = value === '' ? undefined : value)}
            invalidParameters={groupInvalidParametersByName.value.get('filters[name]') ?? []}
          />
          <Button data-testid="pet-filters-form-submit" colorTheme="blue">
            Filter
          </Button>
        </FieldSet>
      </form>
    );
  },
  {
    name: 'PetFiltersForm',
    props: ['httpError', 'initialPetFilters', 'submitPetFilters'],
  },
);
