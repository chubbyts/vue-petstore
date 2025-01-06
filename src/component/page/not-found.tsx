import { defineComponent, onMounted } from 'vue';
import { H1 } from '../heading';

const pageTitle = 'Not Found';

const NotFound = defineComponent(
  () => {
    onMounted(() => {
      // eslint-disable-next-line functional/immutable-data
      document.title = pageTitle;
    });

    return () => (
      <div>
        <H1>{pageTitle}</H1>
      </div>
    );
  },
  {
    name: 'NotFound',
  },
);

export default NotFound;
