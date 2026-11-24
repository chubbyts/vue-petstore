import type { HTMLAttributes, SlotsType, VNode } from 'vue';
import { defineComponent } from 'vue';
import { DateTime } from './date-time';
import { cx } from './class-names';

type DivProps = HTMLAttributes & { class?: string };

export const cardClasses = 'flex flex-col rounded-xl border border-line bg-surface';

export const Card = defineComponent(
  (props: DivProps, { slots }) => {
    return () => <section class={cx(cardClasses, props.class)}>{slots.default?.()}</section>;
  },
  {
    name: 'Card',
    props: ['class'],
    slots: Object as SlotsType<{ default?: () => VNode[] }>,
  },
);

// cards use 18px (4.5) spacing all around: body, footer text and footer buttons
export const CardBody = defineComponent(
  (props: DivProps, { slots }) => {
    return () => <div class={cx('flex flex-col gap-5 p-4.5', props.class)}>{slots.default?.()}</div>;
  },
  {
    name: 'CardBody',
    props: ['class'],
    slots: Object as SlotsType<{ default?: () => VNode[] }>,
  },
);

export const CardFooter = defineComponent(
  (props: DivProps, { slots }) => {
    return () => (
      <div
        class={cx(
          'border-line bg-surface-muted flex flex-wrap items-center gap-2 rounded-b-xl border-t p-4.5',
          props.class,
        )}
      >
        {slots.default?.()}
      </div>
    );
  },
  {
    name: 'CardFooter',
    props: ['class'],
    slots: Object as SlotsType<{ default?: () => VNode[] }>,
  },
);

export type MetaProps = { id: string; createdAt: string; updatedAt?: string | null };

export const Meta = defineComponent(
  (props: MetaProps) => {
    return () => (
      // 3 × 14px lines + 2 × 1px gaps = 44px, the height of the footer buttons, so both get the same spacing
      <div class="text-fg-muted flex min-w-0 flex-col gap-px text-[13px] leading-4">
        <span class="break-all">ID: {props.id}</span>
        <span>
          Created: <DateTime value={props.createdAt} />
        </span>
        <span>Last updated: {props.updatedAt ? <DateTime value={props.updatedAt} /> : 'Never'}</span>
      </div>
    );
  },
  {
    name: 'Meta',
    props: ['id', 'createdAt', 'updatedAt'],
  },
);
