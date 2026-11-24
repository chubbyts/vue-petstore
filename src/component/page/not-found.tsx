import { defineComponent } from 'vue';
import { PageHeader } from '../heading';
import { BackToList } from '../partial/back-to-list';
import { useDocumentTitle } from '../../hook/use-document-title';

const pageTitle = 'Not Found';

const NotFound = defineComponent(
  () => {
    useDocumentTitle(pageTitle);

    return () => (
      <div data-testid="page-not-found" class="flex flex-col gap-[22px]">
        <PageHeader eyebrow="404" title={pageTitle} v-slots={{ action: () => <BackToList to="/pet" /> }} />
        <p class="text-fg-muted m-0">There is no page at this address.</p>
      </div>
    );
  },
  {
    name: 'NotFound',
  },
);

export default NotFound;
