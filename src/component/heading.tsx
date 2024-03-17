import type { HTMLAttributes, SlotsType, VNode } from 'vue';
import { defineComponent } from 'vue';

export const H1 = defineComponent(
  (props: HTMLAttributes, { slots }) => {
    return () => (
      <h1 {...props} class={`mb-4 border-b pb-2 text-4xl font-black ${props.class ?? ''}`}>
        {slots.default()}
      </h1>
    );
  },
  {
    name: 'H1',
    props: ['class'],
    slots: Object as SlotsType<{ default: () => VNode[] }>,
  },
);
