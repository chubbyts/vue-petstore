import { defineComponent, onMounted, onUnmounted } from 'vue';
import { H1 } from '../heading';

const pageTitle = 'Not Found';

const NotFound = defineComponent(
  () => {
    onMounted(() => {
      document.title = pageTitle;
    });

    onUnmounted(() => {
      document.title = '';
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
