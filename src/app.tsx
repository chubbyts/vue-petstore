import { defineComponent, ref } from 'vue';
import { RouterLink, RouterView } from 'vue-router';

const App = defineComponent(() => {
  const displayMenu = ref<boolean>(false);

  const toggleMenu = () => {
    // eslint-disable-next-line functional/immutable-data
    displayMenu.value = !displayMenu.value;
  };

  return () => (
    <div class="relative flex min-h-full flex-col md:flex-row">
      <nav class="absolute flow-root h-16 w-full bg-gray-900 px-4 py-3 text-2xl font-semibold uppercase leading-relaxed text-gray-100">
        <button class="float-right block border-2 p-2 md:hidden" data-testid="navigation-toggle" onClick={toggleMenu}>
          <span class="block h-2 w-6 border-t-2" />
          <span class="block h-2 w-6 border-t-2" />
          <span class="block h-0 w-6 border-t-2" />
        </button>
        <RouterLink to="/" class="hover:text-gray-500">
          Petstore
        </RouterLink>
      </nav>
      <nav
        class={`mt-16 w-full bg-gray-200 md:block md:w-1/3 lg:w-1/4 xl:w-1/5 ${displayMenu.value ? 'block' : 'hidden'}`}
      >
        <ul>
          <li>
            <RouterLink to="/pet">
              {(props: { isActive: boolean }) => (
                <span
                  class={`block px-4 py-2 ${
                    props.isActive
                      ? 'bg-gray-700 text-gray-100 hover:bg-gray-600'
                      : 'bg-gray-300 text-gray-900 hover:bg-gray-400'
                  }`}
                >
                  Petstore
                </span>
              )}
            </RouterLink>
          </li>
        </ul>
      </nav>
      <div class={`w-full px-6 py-8 md:w-2/3 lg:w-3/4 xl:w-4/5 ${displayMenu.value ? 'mt-0' : 'mt-16'}`}>
        <RouterView />
      </div>
    </div>
  );
});

export default App;
