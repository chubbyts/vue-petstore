import type { HTMLAttributes, SlotsType, TableHTMLAttributes, TdHTMLAttributes, ThHTMLAttributes, VNode } from 'vue';
import { defineComponent } from 'vue';

export const Table = defineComponent(
  (props: TableHTMLAttributes, { slots }) => {
    return () => (
      <div {...props} class={`block w-full md:table ${props.class ?? ''}`}>
        {slots.default()}
      </div>
    );
  },
  {
    name: 'Table',
    props: ['class'],
    slots: Object as SlotsType<{ default: () => VNode[] }>,
  },
);

export const Thead = defineComponent(
  (props: HTMLAttributes, { slots }) => {
    return () => (
      <div {...props} class={`block w-full md:table-header-group ${props.class ?? ''}`}>
        {slots.default()}
      </div>
    );
  },
  {
    name: 'Thead',
    props: ['class'],
    slots: Object as SlotsType<{ default: () => VNode[] }>,
  },
);

export const Tbody = defineComponent(
  (props: HTMLAttributes, { slots }) => {
    return () => (
      <div {...props} class={`block w-full md:table-row-group ${props.class ?? ''}`}>
        {slots.default()}
      </div>
    );
  },
  {
    name: 'Tbody',
    props: ['class'],
    slots: Object as SlotsType<{ default: () => VNode[] }>,
  },
);

export const Tr = defineComponent(
  (props: HTMLAttributes, { slots }) => {
    return () => (
      <div {...props} class={`mb-5 block even:bg-gray-100 md:mt-0 md:table-row ${props.class ?? ''}`}>
        {slots.default()}
      </div>
    );
  },
  {
    name: 'Tr',
    props: ['class'],
    slots: Object as SlotsType<{ default: () => VNode[] }>,
  },
);

export const Th = defineComponent(
  (props: ThHTMLAttributes, { slots }) => {
    return () => (
      <div
        {...props}
        class={`block border-x border-gray-300 bg-gray-100 px-4 font-bold first:border-t first:pt-3 last:border-b last:pb-3 md:table-cell md:border-x-0 md:border-y md:px-4 md:py-3 md:first:border-l md:last:border-r ${
          props.class ?? ''
        }`}
      >
        {slots.default()}
      </div>
    );
  },
  {
    name: 'Th',
    props: ['class'],
    slots: Object as SlotsType<{ default: () => VNode[] }>,
  },
);

export const Td = defineComponent(
  (props: TdHTMLAttributes, { slots }) => {
    return () => (
      <div
        {...props}
        class={`block border-x border-gray-300 px-4 first:border-t first:pt-3 last:border-b last:pb-3 md:table-cell md:border-x-0 md:border-b md:px-4 md:py-3 md:first:border-l md:first:border-t-0 md:last:border-r ${
          props.class ?? ''
        }`}
      >
        {slots.default()}
      </div>
    );
  },
  {
    name: 'Td',
    props: ['class'],
    slots: Object as SlotsType<{ default: () => VNode[] }>,
  },
);
