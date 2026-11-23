import type { VNode } from 'vue';
import { computed, defineComponent, nextTick, reactive, ref, watch } from 'vue';
import type { HttpError } from '../../client/error';
import { createInvalidParametersByName } from '../../client/error';
import { AnchorButton, Button } from '../button';
import { cardClasses, CardBody, CardFooter } from '../card';
import { cx } from '../class-names';
import { TrashIcon } from '../icon';
import { BackToList } from '../partial/back-to-list';
import { useListKeys } from '../../hook/use-list-keys';
import type { PetRequest } from '../../model/pet';
import { FieldErrors, inputClasses, labelClasses, TextField } from './form';

export type PetFormProps = {
  httpError?: HttpError;
  initialPet?: PetRequest;
  submitPet: (pet: PetRequest) => void;
  submitLabel: string;
  cancelTo: string;
  listTo: string;
  meta?: () => VNode;
  isPending?: boolean;
};

// rows get added / removed: focus the element once it's rendered (call after the change, so it's rendered first)
const focusAfterRender = (id: string): void => {
  void nextTick(() => document.getElementById(id)?.focus());
};

export const PetForm = defineComponent(
  (props: PetFormProps) => {
    const groupInvalidParametersByName = computed(() => createInvalidParametersByName(props.httpError));

    // a copy: the initial pet (e.g. the cached response) stays as it is
    const pet = reactive<PetRequest>(
      props.initialPet
        ? { ...props.initialPet, vaccinations: [...props.initialPet.vaccinations] }
        : { name: '', vaccinations: [] },
    );

    // errors of a vaccination stay with it when other vaccinations get removed
    const vaccinationKeys = useListKeys(pet.vaccinations.length);

    const formRef = ref<HTMLFormElement | null>(null);

    // after a failed save, continue at the first invalid field (the summary is announced by its role alert)
    watch(
      () => props.httpError,
      (httpError) => {
        if (!httpError) {
          return;
        }

        formRef.value?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
      },
      { flush: 'post' },
    );

    const addVaccination = (): void => {
      const focusId = `pet-vaccination-${pet.vaccinations.length}`;

      vaccinationKeys.add();
      // oxlint-disable-next-line functional/immutable-data
      pet.vaccinations = [...pet.vaccinations, { name: '' }];
      focusAfterRender(focusId);
    };

    // the removed row (and its button) is gone: continue at the row now at that place, the previous one or add
    const removeVaccination = (i: number): void => {
      const remaining = pet.vaccinations.length - 1;

      vaccinationKeys.remove(i);
      // oxlint-disable-next-line functional/immutable-data
      pet.vaccinations = pet.vaccinations.filter((_, y) => y !== i);
      focusAfterRender(remaining > 0 ? `pet-vaccination-${Math.min(i, remaining - 1)}` : 'pet-add-vaccination');
    };

    const setVaccinationName = (i: number, name: string): void => {
      // oxlint-disable-next-line functional/immutable-data
      pet.vaccinations = pet.vaccinations.map((vaccination, y) => (y === i ? { ...vaccination, name } : vaccination));
    };

    return () => (
      <form
        ref={formRef}
        class={cardClasses}
        novalidate
        onSubmit={(e: Event) => {
          e.preventDefault();
          e.stopPropagation();
          vaccinationKeys.submit();
          props.submitPet({ ...pet, vaccinations: [...pet.vaccinations] });
        }}
      >
        <CardBody>
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <TextField
              dataTestId="pet-form-name"
              id="pet-name"
              label={[
                'Name ',
                <span aria-hidden="true" class="text-danger">
                  *
                </span>,
              ]}
              required
              value={pet.name}
              // oxlint-disable-next-line functional/immutable-data
              setValue={(value: string) => (pet.name = value)}
              invalidParameters={groupInvalidParametersByName.value.get('name') ?? []}
            />
            <TextField
              dataTestId="pet-form-tag"
              id="pet-tag"
              label={['Tag ', <span class="text-fg-muted font-normal">· optional</span>]}
              placeholder="e.g. dog, cat"
              value={pet.tag ?? ''}
              // oxlint-disable-next-line functional/immutable-data
              setValue={(value: string) => (pet.tag = value === '' ? undefined : value)}
              invalidParameters={groupInvalidParametersByName.value.get('tag') ?? []}
            />
          </div>
          <div role="group" aria-labelledby="pet-vaccinations" class="flex flex-col gap-2">
            <div class="flex items-center justify-between gap-2">
              <span id="pet-vaccinations" class={labelClasses}>
                Vaccinations <span class="text-fg-muted font-normal">({pet.vaccinations.length})</span>
              </span>
              <Button
                data-testid="pet-form-add-vaccination"
                id="pet-add-vaccination"
                variant="secondary"
                size="sm"
                class="text-sm"
                onClick={addVaccination}
              >
                + Add vaccination
              </Button>
            </div>
            <FieldErrors
              id="pet-vaccinations-errors"
              invalidParameters={groupInvalidParametersByName.value.get('vaccinations') ?? []}
            />
            {pet.vaccinations.length > 0 ? (
              <ol class="m-0 flex list-none flex-col gap-2 p-0">
                {pet.vaccinations.map((vaccination, i) => {
                  const invalidParameters =
                    groupInvalidParametersByName.value.get(
                      `vaccinations[${vaccinationKeys.submittedIndex(i)}][name]`,
                    ) ?? [];
                  const errorId = `pet-vaccination-${i}-errors`;

                  return (
                    <li key={vaccinationKeys.keys.value[i]} class="flex flex-col gap-1">
                      <div class="flex items-center gap-2">
                        <input
                          data-testid={`pet-form-vaccinations-${i}-name`}
                          id={`pet-vaccination-${i}`}
                          type="text"
                          aria-label={`Vaccination ${i + 1} name`}
                          aria-invalid={invalidParameters.length > 0 || undefined}
                          aria-describedby={invalidParameters.length > 0 ? errorId : undefined}
                          class={cx('h-10 flex-1', inputClasses(invalidParameters.length > 0))}
                          value={vaccination.name}
                          onInput={(e: Event) => setVaccinationName(i, (e.target as HTMLInputElement).value)}
                        />
                        <Button
                          data-testid={`pet-form-remove-vaccination-${i}`}
                          variant="ghost-danger"
                          size="md"
                          class="border-line-control border"
                          aria-label={`Remove vaccination ${i + 1}`}
                          onClick={() => removeVaccination(i)}
                        >
                          <TrashIcon />
                          Remove
                        </Button>
                      </div>
                      <FieldErrors id={errorId} invalidParameters={invalidParameters} />
                    </li>
                  );
                })}
              </ol>
            ) : (
              <p class="border-line-strong text-fg-muted m-0 rounded-lg border border-dashed p-4 text-center text-sm">
                No vaccinations yet.
              </p>
            )}
          </div>
        </CardBody>
        <CardFooter>
          {props.meta?.()}
          <span class="flex-1" />
          <BackToList to={props.listTo} />
          <AnchorButton data-testid="pet-form-cancel" to={props.cancelTo} variant="secondary">
            Cancel
          </AnchorButton>
          <Button data-testid="pet-form-submit" type="submit" variant="primary" disabled={props.isPending}>
            {props.submitLabel}
          </Button>
        </CardFooter>
      </form>
    );
  },
  {
    name: 'PetForm',
    props: ['httpError', 'initialPet', 'submitPet', 'submitLabel', 'cancelTo', 'listTo', 'meta', 'isPending'],
  },
);
