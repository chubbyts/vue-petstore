import type { SlotsType, VNode } from 'vue';
import { computed, defineComponent } from 'vue';
import { buttonClasses } from '../button';
import { cx } from '../class-names';
import { Link } from '../link';

// e.g. "Showing 11–12 of 12", "No results" if there is nothing to show
export const formatRange = (offset: number, limit: number, count: number): string => {
  if (count === 0) {
    return 'No results';
  }

  return `Showing ${offset + 1}–${Math.min(offset + limit, count)} of ${count}`;
};

// up to maxPages page numbers around the current page, sorted ascending
export const calculatePages = (currentPage: number, totalPages: number, maxPages: number): Array<number> => {
  if (totalPages <= 1 || maxPages <= 1 || currentPage > totalPages) {
    return [];
  }

  const pages = [currentPage];

  // oxlint-disable-next-line functional/no-let
  for (let i = 1; ; i++) {
    if (currentPage - i >= 1) {
      // oxlint-disable-next-line functional/immutable-data
      pages.push(currentPage - i);

      if (pages.length === maxPages || pages.length === totalPages) {
        break;
      }
    }

    if (currentPage + i <= totalPages) {
      // oxlint-disable-next-line functional/immutable-data
      pages.push(currentPage + i);

      if (pages.length === maxPages || pages.length === totalPages) {
        break;
      }
    }
  }

  // oxlint-disable-next-line functional/immutable-data
  pages.sort((a, b) => a - b);

  return pages;
};

type PageLinkProps = {
  to: string;
  label: string;
  current?: boolean;
  disabled?: boolean;
};

// always the same element (also when disabled), so it keeps the keyboard focus when the page changes
const PageLink = defineComponent(
  (props: PageLinkProps, { slots, attrs }) => {
    return () => (
      <li>
        <Link
          {...attrs}
          to={props.to}
          aria-label={props.label}
          title={props.label}
          aria-current={props.current ? 'page' : undefined}
          aria-disabled={props.disabled || undefined}
          // out of the tab order when disabled, but still focusable so the focus is not lost
          tabindex={props.disabled ? -1 : undefined}
          onClick={props.disabled ? (e: MouseEvent) => e.preventDefault() : undefined}
          class={cx(
            buttonClasses({ variant: props.current ? 'primary' : 'secondary', size: 'sm' }),
            // windows high contrast removes backgrounds: keep the current page recognizable
            props.current && 'forced-colors:outline forced-colors:outline-2',
            'min-w-9',
            props.disabled && 'pointer-events-none opacity-40',
          )}
        >
          {slots.default?.()}
        </Link>
      </li>
    );
  },
  {
    name: 'PageLink',
    props: ['to', 'label', 'current', 'disabled'],
    inheritAttrs: false,
    slots: Object as SlotsType<{ default?: () => VNode[] }>,
  },
);

export type PaginationProps = {
  // as returned by the list endpoints
  offset: number;
  limit: number;
  count: number;
  // url of a (1-based) page, the pages are links: they can be opened in a new tab, bookmarked and shared
  pageTo: (page: number) => string;
  // max number of page links
  maxPages?: number;
};

export const Pagination = defineComponent(
  (props: PaginationProps) => {
    const currentPage = computed(() => Math.floor(props.offset / props.limit) + 1);
    const totalPages = computed(() => Math.ceil(props.count / props.limit));
    const pages = computed(() => calculatePages(currentPage.value, totalPages.value, props.maxPages ?? 7));

    return () => {
      const isFirst = currentPage.value <= 1;
      const isLast = currentPage.value >= totalPages.value;

      return (
        <nav
          aria-label="Pagination"
          class="border-line bg-surface-muted flex flex-wrap items-center justify-between gap-3 border-t px-4 py-3"
        >
          {/* announced by screen readers when the page (or filter) changes */}
          <span aria-live="polite" aria-atomic="true" class="text-fg-muted text-sm">
            {formatRange(props.offset, props.limit, props.count)}
          </span>
          {pages.value.length > 0 ? (
            <ul class="m-0 flex list-none flex-wrap gap-1.5 p-0">
              <PageLink data-testid="pagination-first" to={props.pageTo(1)} label="First page" disabled={isFirst}>
                <span aria-hidden="true">«</span>
              </PageLink>
              <PageLink
                data-testid="pagination-previous"
                to={props.pageTo(Math.max(1, currentPage.value - 1))}
                label="Previous page"
                disabled={isFirst}
              >
                <span aria-hidden="true">‹</span>
              </PageLink>
              {pages.value.map((page) => (
                <PageLink
                  key={page}
                  data-testid={`pagination-page-${page}`}
                  to={props.pageTo(page)}
                  label={`Page ${page}`}
                  current={page === currentPage.value}
                >
                  {page}
                </PageLink>
              ))}
              <PageLink
                data-testid="pagination-next"
                to={props.pageTo(Math.min(totalPages.value, currentPage.value + 1))}
                label="Next page"
                disabled={isLast}
              >
                <span aria-hidden="true">›</span>
              </PageLink>
              <PageLink
                data-testid="pagination-last"
                to={props.pageTo(totalPages.value)}
                label="Last page"
                disabled={isLast}
              >
                <span aria-hidden="true">»</span>
              </PageLink>
            </ul>
          ) : null}
        </nav>
      );
    };
  },
  {
    name: 'Pagination',
    props: ['offset', 'limit', 'count', 'pageTo', 'maxPages'],
  },
);
