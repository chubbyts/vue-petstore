import { createApp } from 'vue';
import './index.css';
import App from './app.tsx';
import { routes } from './routes.ts';
import { createWebHistory, createRouter } from 'vue-router';

createApp(App)
  .use(
    createRouter({
      history: createWebHistory(),
      routes,
    }),
  )
  .mount('#root');
