import { computed, defineComponent } from 'vue';

const calculatePages = (currentPage: number, totalPages: number, maxPages: number) => {
  if (totalPages <= 1 || maxPages <= 1 || currentPage > totalPages) {
    return [];
  }

  const pages = [currentPage];

  // eslint-disable-next-line functional/no-let
  for (let i = 1; ; i++) {
    if (currentPage - i >= 1) {
      // eslint-disable-next-line functional/immutable-data
      pages.push(currentPage - i);

      if (pages.length === maxPages || pages.length === totalPages) {
        break;
      }
    }

    if (currentPage + i <= totalPages) {
      // eslint-disable-next-line functional/immutable-data
      pages.push(currentPage + i);

      if (pages.length === maxPages || pages.length === totalPages) {
        break;
      }
    }
  }

  // eslint-disable-next-line functional/immutable-data
  pages.sort((a, b) => a - b);

  return pages;
};

export const Pagination = defineComponent(
  (props: { currentPage: number; totalPages: number; maxPages: number; submitPage: (page: number) => void }) => {
    const pages = computed(() => calculatePages(props.currentPage, props.totalPages, props.maxPages));

    return () => (
      <>
        {pages.value.length > 0 ? (
          <ul class="w-fit border-y border-l border-gray-300">
            {props.currentPage > 2 ? (
              <li class="inline-block">
                <button
                  class="border-r border-gray-300 px-3 py-2"
                  onClick={() => {
                    props.submitPage(1);
                  }}
                >
                  &laquo;
                </button>
              </li>
            ) : null}
            {props.currentPage > 1 ? (
              <li class="inline-block">
                <button
                  class="border-r border-gray-300 px-3 py-2"
                  onClick={() => {
                    props.submitPage(props.currentPage - 1);
                  }}
                >
                  &lt;
                </button>
              </li>
            ) : null}
            {pages.value.map((page: number) => (
              <li key={page} class="inline-block">
                <button
                  class={`border-r border-gray-300 px-3 py-2 ${page === props.currentPage ? 'bg-gray-100' : ''}`}
                  onClick={() => {
                    props.submitPage(page);
                  }}
                >
                  {page}
                </button>
              </li>
            ))}
            {props.currentPage < props.totalPages ? (
              <li class="inline-block">
                <button
                  class="border-r border-gray-300 px-3 py-2"
                  onClick={() => {
                    props.submitPage(props.currentPage + 1);
                  }}
                >
                  &gt;
                </button>
              </li>
            ) : null}
            {props.currentPage < props.totalPages - 1 ? (
              <li class="inline-block">
                <button
                  class="border-r border-gray-300 px-3 py-2"
                  onClick={() => {
                    props.submitPage(props.totalPages);
                  }}
                >
                  &raquo;
                </button>
              </li>
            ) : null}
          </ul>
        ) : null}
      </>
    );
  },
  {
    name: 'Pagination',
    props: ['currentPage', 'totalPages', 'maxPages', 'submitPage'],
  },
);
