import type { Ref } from 'vue';
import { ref } from 'vue';

export type ListKeys = {
  // stable key per row: use as vue key, it stays with its row when rows get added / removed
  keys: Ref<Array<number>>;
  add: () => void;
  remove: (i: number) => void;
  // call on submit: remembers the order of the rows as sent to the server
  submit: () => void;
  // index of row i in the last submit (-1 if added since), to find its errors (e.g. `vaccinations[${index}][name]`)
  submittedIndex: (i: number) => number;
};

// the server reports errors by the index in the submitted list: removing a row would move them to the next row
export const useListKeys = (initialLength: number): ListKeys => {
  // oxlint-disable-next-line functional/no-let
  let nextKey = initialLength;
  const keys = ref<Array<number>>(Array.from({ length: initialLength }, (_, i) => i));
  const submittedKeys = ref<Array<number>>(keys.value);

  return {
    keys,
    add: () => {
      // oxlint-disable-next-line functional/immutable-data
      keys.value = [...keys.value, nextKey++];
    },
    // oxlint-disable-next-line functional/immutable-data
    remove: (i) => (keys.value = keys.value.filter((_, y) => y !== i)),
    // oxlint-disable-next-line functional/immutable-data
    submit: () => (submittedKeys.value = keys.value),
    submittedIndex: (i) => submittedKeys.value.indexOf(keys.value[i]),
  };
};
