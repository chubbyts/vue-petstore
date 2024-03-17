import { defineComponent, onMounted, onUnmounted } from 'vue';
import { H1 } from '../heading';

const pageTitle = 'Home';

const Home = defineComponent(
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
    name: 'Home',
  },
);

export default Home;
