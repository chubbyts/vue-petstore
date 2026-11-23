import { defineComponent } from 'vue';

// nothing visible (the page appears when loaded), but screen readers get told something is happening
export const Loading = defineComponent(
  () => {
    return () => (
      <p role="status" data-testid="loading" class="sr-only">
        Loading…
      </p>
    );
  },
  {
    name: 'Loading',
  },
);
