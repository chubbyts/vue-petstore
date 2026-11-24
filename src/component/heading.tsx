import type { HTMLAttributes, SlotsType, VNode } from 'vue';
import { defineComponent } from 'vue';
import { cx } from './class-names';
import { Link } from './link';

export const H1 = defineComponent(
  (props: HTMLAttributes & { class?: string }, { slots }) => {
    return () => (
      <h1 class={cx('m-0 text-[26px] font-bold tracking-[-0.01em] break-words', props.class)}>{slots.default?.()}</h1>
    );
  },
  {
    name: 'H1',
    props: ['class'],
    slots: Object as SlotsType<{ default?: () => VNode[] }>,
  },
);

export type BreadcrumbItem = { label: string; to?: string };

export const Breadcrumb = defineComponent(
  (props: { items: Array<BreadcrumbItem> }) => {
    return () => (
      <nav aria-label="Breadcrumb" class="text-fg-muted text-sm">
        <ol class="m-0 flex list-none flex-wrap items-center gap-2 p-0">
          {props.items.map((item, i) => (
            <li key={i} class="flex items-center gap-2">
              {i > 0 ? <span aria-hidden="true">/</span> : null}
              {item.to ? (
                <Link to={item.to} class="text-fg-muted hover:text-fg no-underline hover:underline">
                  {item.label}
                </Link>
              ) : (
                <span aria-current="page" class="text-fg">
                  {item.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    );
  },
  {
    name: 'Breadcrumb',
    props: ['items'],
  },
);

export type PageHeaderProps = {
  eyebrow?: string;
  title: string;
};

export const PageHeader = defineComponent(
  (props: PageHeaderProps, { slots }) => {
    return () => (
      <header class="flex flex-wrap items-end justify-between gap-4">
        <div class="flex min-w-0 flex-col gap-1">
          {props.eyebrow ? <span class="text-fg-muted text-sm">{props.eyebrow}</span> : null}
          <H1>{props.title}</H1>
        </div>
        {slots.action?.()}
      </header>
    );
  },
  {
    name: 'PageHeader',
    props: ['eyebrow', 'title'],
    slots: Object as SlotsType<{ action?: () => VNode | Array<VNode> | null }>,
  },
);
