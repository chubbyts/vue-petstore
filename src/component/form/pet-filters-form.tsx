import { computed, defineComponent, ref, watch } from 'vue';
import type { HttpError } from '../../client/error';
import { createInvalidParametersByName } from '../../client/error';
import { cx } from '../class-names';
import { SearchIcon } from '../icon';
import type { PetFilters } from '../../model/pet';
import { FieldErrors, inputClasses } from './form';

// filters while typing, once there was no keystroke for this long (ms): not a request per character
export const filterDelay = 300;

export type PetFiltersFormProps = {
  httpError?: HttpError;
  initialPetFilters: PetFilters;
  submitPetFilters: (filters: PetFilters) => void;
};

export const PetFiltersForm = defineComponent(
  (props: PetFiltersFormProps) => {
    const groupInvalidParametersByName = computed(() => createInvalidParametersByName(props.httpError));
    const invalidParameters = computed(() => groupInvalidParametersByName.value.get('filters[name]') ?? []);

    const initialName = computed(() => props.initialPetFilters.name ?? '');
    const name = ref<string>(initialName.value);

    // the last name submitted from here (or received from outside)
    // oxlint-disable-next-line functional/no-let
    let submittedName = initialName.value;

    // follow outer changes (e.g. "Clear filter"), but not the ones submitted from here: would undo the typing since
    watch(initialName, (currentInitialName) => {
      if (currentInitialName === submittedName) {
        return;
      }

      submittedName = currentInitialName;
      // oxlint-disable-next-line functional/immutable-data
      name.value = currentInitialName;
    });

    const submit = (value: string) => {
      if (value === submittedName) {
        return;
      }

      submittedName = value;
      props.submitPetFilters({ ...props.initialPetFilters, name: value === '' ? undefined : value });
    };

    // restarts the delay on typing only: other renders (e.g. a refetch) don't postpone the filtering
    watch(name, (currentName, _, onCleanup) => {
      const timeout = setTimeout(() => submit(currentName), filterDelay);

      onCleanup(() => clearTimeout(timeout));
    });

    return () => {
      const hasError = invalidParameters.value.length > 0;

      return (
        <form
          role="search"
          class="flex flex-[1_1_260px] flex-col gap-1"
          onSubmit={(e: Event) => {
            e.preventDefault();
            e.stopPropagation();
            submit(name.value);
          }}
        >
          <label class="relative flex items-center">
            <span class="sr-only">Filter by name</span>
            <span class="text-fg-muted pointer-events-none absolute left-3 flex">
              <SearchIcon />
            </span>
            <input
              data-testid="pet-filters-form-name"
              type="search"
              placeholder="Filter by name"
              class={cx('h-10 w-full pr-3 pl-9', inputClasses(hasError))}
              aria-invalid={hasError || undefined}
              aria-describedby={cx('pet-filters-name-hint', hasError && 'pet-filters-name-errors')}
              value={name.value}
              // oxlint-disable-next-line functional/immutable-data
              onInput={(e: Event) => (name.value = (e.target as HTMLInputElement).value)}
            />
          </label>
          <span id="pet-filters-name-hint" class="sr-only">
            Results update as you type
          </span>
          <FieldErrors id="pet-filters-name-errors" invalidParameters={invalidParameters.value} />
        </form>
      );
    };
  },
  {
    name: 'PetFiltersForm',
    props: ['httpError', 'initialPetFilters', 'submitPetFilters'],
  },
);
