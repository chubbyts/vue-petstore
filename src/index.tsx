import { createApp } from 'vue';
import { createWebHistory, createRouter } from 'vue-router';
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query';
import App from './app.tsx';
import { routes } from './routes.ts';
import './index.css';

const queryClient = new QueryClient();

createApp(App)
  .use(VueQueryPlugin, { queryClient })
  .use(
    createRouter({
      history: createWebHistory(),
      routes,
    }),
  )
  .mount('#root');
