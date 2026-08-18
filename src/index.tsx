import { createApp } from 'vue';
import { createWebHistory, createRouter } from 'vue-router';
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query';
import { OidcProvider } from './hook/use-oidc.tsx';
import { oidcConfig } from './oidc.ts';
import App from './app.tsx';
import { routes } from './routes.ts';
import './index.css';

const queryClient = new QueryClient();

createApp(() => (
  <OidcProvider {...oidcConfig}>
    <App />
  </OidcProvider>
))
  .use(VueQueryPlugin, { queryClient })
  .use(
    createRouter({
      history: createWebHistory(),
      routes,
    }),
  )
  .mount('#root');
