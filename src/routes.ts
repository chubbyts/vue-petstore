import type { RouteRecordRaw } from 'vue-router';

const Home = () => import('./component/page/home');
const PetList = () => import('./component/page/pet/list');
const PetCreate = () => import('./component/page/pet/create');
const PetRead = () => import('./component/page/pet/read');
const PetUpdate = () => import('./component/page/pet/update');
const NotFound = () => import('./component/page/not-found');

export const routes: Array<RouteRecordRaw> = [
  { path: '/', name: 'Home', component: Home },
  {
    path: '/pet',
    children: [
      { path: '', name: 'PetList', component: PetList },
      { path: 'create', name: 'PetCreate', component: PetCreate },
      { path: ':id', name: 'PetRead', component: PetRead },
      { path: ':id/update', name: 'PetUpdate', component: PetUpdate },
    ],
  },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
];
