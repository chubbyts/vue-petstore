import { defineComponent, onMounted } from 'vue';
import { H1 } from '../heading';

const pageTitle = 'Home';

const Home = defineComponent(
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
    name: 'Home',
  },
);

export default Home;
