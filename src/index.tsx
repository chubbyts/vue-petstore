import { createApp } from 'vue';
import './index.css';
import { createWebHistory, createRouter } from 'vue-router';
import App from './app.tsx';
import { routes } from './routes.ts';

createApp(App)
  .use(
    createRouter({
      history: createWebHistory(),
      routes,
    }),
  )
  .mount('#root');
