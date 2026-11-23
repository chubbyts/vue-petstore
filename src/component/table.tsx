import type {
  HTMLAttributes,
  InjectionKey,
  SlotsType,
  TableHTMLAttributes,
  TdHTMLAttributes,
  ThHTMLAttributes,
  VNode,
} from 'vue';
import { Comment, Fragment, defineComponent, inject, provide } from 'vue';
import { cx } from './class-names';

export type SortDirection = 'asc' | 'desc';

type Align = 'left' | 'right';

const alignClasses: Record<Align, string> = { left: 'text-left', right: 'text-right' };

const sortArrows = { asc: '↑', desc: '↓', none: '↕' };

const ariaSorts = { asc: 'ascending', desc: 'descending' } as const;

// stacked: the rows are shown as cards (one below the other) if the table is narrower than 48rem (container query)
const StackedKey: InjectionKey<boolean> = Symbol('TableStacked');

// the rows of the head are not shown as cards
const HeadKey: InjectionKey<boolean> = Symbol('TableHead');

// nothing rendered: no slot, or only comments (e.g. a condition rendering null)
const isEmpty = (vnodes: Array<VNode> | undefined): boolean =>
  !vnodes ||
  vnodes.every(
    (vnode) =>
      vnode.type === Comment || (vnode.type === Fragment && isEmpty(vnode.children as Array<VNode> | undefined)),
  );

export type TableProps = TableHTMLAttributes & {
  class?: string;
  // rows as cards on narrow screens instead of scrolling horizontally, use the `label` of the cells
  stackOnNarrow?: boolean;
};

// scrolls horizontally instead of squeezing the columns on small screens (unless stacked)
export const Table = defineComponent(
  (props: TableProps, { slots, attrs }) => {
    provide(StackedKey, props.stackOnNarrow ?? false);

    // the attributes (e.g. data-testid) go to the table, not to the scroll container around it
    return () => (
      <div class={cx('overflow-x-auto', props.stackOnNarrow && '@container')}>
        <table
          {...attrs}
          class={cx(
            'w-full border-collapse text-left',
            props.class,
            props.stackOnNarrow && '@max-3xl:block @max-3xl:min-w-0',
          )}
        >
          {slots.default?.()}
        </table>
      </div>
    );
  },
  {
    name: 'Table',
    props: ['class', 'stackOnNarrow'],
    inheritAttrs: false,
    slots: Object as SlotsType<{ default?: () => VNode[] }>,
  },
);

type SectionProps = HTMLAttributes & { class?: string };

export const Thead = defineComponent(
  (props: SectionProps, { slots }) => {
    const stacked = inject(StackedKey, false);

    provide(HeadKey, true);

    return () => (
      <thead class={cx('bg-surface-muted', stacked && '@max-3xl:block', props.class)}>{slots.default?.()}</thead>
    );
  },
  {
    name: 'Thead',
    props: ['class'],
    slots: Object as SlotsType<{ default?: () => VNode[] }>,
  },
);

export const Tbody = defineComponent(
  (props: SectionProps, { slots }) => {
    const stacked = inject(StackedKey, false);

    return () => <tbody class={cx(stacked && '@max-3xl:block', props.class)}>{slots.default?.()}</tbody>;
  },
  {
    name: 'Tbody',
    props: ['class'],
    slots: Object as SlotsType<{ default?: () => VNode[] }>,
  },
);

export type TrProps = HTMLAttributes & { class?: string };

// "group" lets the cells highlight the whole row on hover
export const Tr = defineComponent(
  (props: TrProps, { slots }) => {
    const stacked = inject(StackedKey, false);
    const head = inject(HeadKey, false);

    return () => (
      <tr
        class={cx(
          'group',
          stacked &&
            (head
              ? '@max-3xl:flex'
              : 'border-line @max-3xl:hover:bg-row-hover @max-3xl:flex @max-3xl:flex-col @max-3xl:gap-2 @max-3xl:border-b @max-3xl:px-4 @max-3xl:py-3.5'),
          props.class,
        )}
      >
        {slots.default?.()}
      </tr>
    );
  },
  {
    name: 'Tr',
    props: ['class'],
    slots: Object as SlotsType<{ default?: () => VNode[] }>,
  },
);

export type ThProps = ThHTMLAttributes & {
  class?: string;
  align?: Align;
  // column only as wide as its content, the remaining width goes to the other columns
  shrink?: boolean;
  // makes the header a sort toggle, `sort` is the current direction of this column (undefined: not sorted)
  // stacked: the only headers shown (the cells have their own labels)
  onSort?: () => void;
  sort?: SortDirection;
};

export const Th = defineComponent(
  (props: ThProps, { slots }) => {
    const stacked = inject(StackedKey, false);

    return () => (
      <th
        scope="col"
        aria-sort={props.onSort && props.sort ? ariaSorts[props.sort] : undefined}
        class={cx(
          'border-line text-fg-muted border-b px-4 py-2.5 text-[13px] font-semibold',
          alignClasses[props.align ?? 'left'],
          props.shrink && 'w-px whitespace-nowrap',
          stacked && (props.onSort ? '@max-3xl:block @max-3xl:grow' : '@max-3xl:hidden'),
          props.class,
        )}
      >
        {props.onSort ? (
          <button type="button" class="text-fg-secondary hover:text-fg p-0 font-semibold" onClick={props.onSort}>
            {slots.default?.()} <span aria-hidden="true">{sortArrows[props.sort ?? 'none']}</span>
          </button>
        ) : (
          slots.default?.()
        )}
      </th>
    );
  },
  {
    name: 'Th',
    props: ['class', 'align', 'shrink', 'onSort', 'sort'],
    slots: Object as SlotsType<{ default?: () => VNode[] }>,
  },
);

export type TdProps = TdHTMLAttributes & {
  class?: string;
  align?: Align;
  // less padding, for cells holding buttons
  compact?: boolean;
  nowrap?: boolean;
  // stacked: shown in front of the value (the column headers are hidden), empty cells are hidden
  label?: string;
};

export const Td = defineComponent(
  (props: TdProps, { slots }) => {
    const stacked = inject(StackedKey, false);

    return () => {
      const children = slots.default?.();
      const empty = isEmpty(children);

      return (
        <td
          class={cx(
            'border-line group-hover:bg-row-hover border-b',
            props.compact ? 'px-3 py-2' : 'px-4 py-3',
            alignClasses[props.align ?? 'left'],
            props.nowrap && 'whitespace-nowrap',
            stacked &&
              (empty
                ? '@max-3xl:hidden'
                : '@max-3xl:flex @max-3xl:flex-wrap @max-3xl:items-center @max-3xl:gap-x-3 @max-3xl:gap-y-1 @max-3xl:border-0 @max-3xl:p-0 @max-3xl:text-left @max-3xl:wrap-break-word @max-3xl:whitespace-normal @max-3xl:group-hover:bg-transparent'),
            props.class,
          )}
        >
          {stacked && props.label && !empty ? (
            <span class="text-fg-muted hidden w-28 shrink-0 text-sm font-medium @max-3xl:inline">{props.label}</span>
          ) : null}
          {children}
        </td>
      );
    };
  },
  {
    name: 'Td',
    props: ['class', 'align', 'compact', 'nowrap', 'label'],
    slots: Object as SlotsType<{ default?: () => VNode[] }>,
  },
);
