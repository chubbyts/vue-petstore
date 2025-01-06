import { computed, defineComponent, reactive } from 'vue';
import type { PetRequest } from '../../model/pet';
import type { HttpError } from '../../client/error';
import { createInvalidParametersByName } from '../../client/error';
import { Button } from '../button';
import { FieldSet, TextField } from './form';

export const PetForm = defineComponent(
  (props: { httpError: HttpError | undefined; initialPet?: PetRequest; submitPet: (pet: PetRequest) => void }) => {
    const groupInvalidParametersByName = computed(() => createInvalidParametersByName(props.httpError));

    const pet = reactive<PetRequest>(props.initialPet ?? { name: '', vaccinations: [] });

    const onSubmit = () => {
      props.submitPet({ ...pet });
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
            dataTestId="pet-form-name"
            label="Name"
            value={pet.name}
            // eslint-disable-next-line functional/immutable-data
            setValue={(value) => (pet.name = value)}
            invalidParameters={groupInvalidParametersByName.value.get('name') ?? []}
          />
          <TextField
            dataTestId="pet-form-tag"
            label="Tag"
            value={pet.tag ?? ''}
            // eslint-disable-next-line functional/immutable-data
            setValue={(value) => (pet.tag = value === '' ? undefined : value)}
            invalidParameters={groupInvalidParametersByName.value.get('tag') ?? []}
          />
          <div class="mb-3">
            <div class="mb-2 block">Vaccinations</div>
            <div>
              {pet.vaccinations.map((vaccination, i) => {
                return (
                  <FieldSet key={i}>
                    <TextField
                      dataTestId={`pet-form-vaccinations-${i}-name`}
                      label="Name"
                      value={vaccination.name}
                      setValue={(value) =>
                        // eslint-disable-next-line functional/immutable-data
                        (pet.vaccinations = [
                          ...pet.vaccinations.map((currentVaccination, y) => {
                            if (y === i) {
                              return { ...currentVaccination, name: value };
                            }

                            return currentVaccination;
                          }),
                        ])
                      }
                      invalidParameters={groupInvalidParametersByName.value.get(`vaccinations[${i}][name]`) ?? []}
                    />
                    <Button
                      data-testid={`pet-form-remove-vaccination-${i}`}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();

                        // eslint-disable-next-line functional/immutable-data
                        pet.vaccinations = [...pet.vaccinations.filter((_, y) => y !== i)];
                      }}
                      colorTheme="red"
                    >
                      Remove
                    </Button>
                  </FieldSet>
                );
              })}
              <Button
                data-testid="pet-form-add-vaccination"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();

                  // eslint-disable-next-line functional/immutable-data
                  pet.vaccinations = [...pet.vaccinations, { name: '' }];
                }}
                colorTheme="green"
              >
                Add
              </Button>
            </div>
          </div>
          <Button data-testid="pet-form-submit" colorTheme="blue">
            Save
          </Button>
        </FieldSet>
      </form>
    );
  },
  {
    name: 'PetForm',
    props: ['httpError', 'initialPet', 'submitPet'],
  },
);
