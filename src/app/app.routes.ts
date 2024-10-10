import { Routes } from '@angular/router';
import { SearchComponent } from './search/search.component';
// import { NotFoundComponent } from './not-found/not-found.component';
// import { ErrorComponent } from './error/error.component';

export const routes: Routes = [
  {
    path: '',
    component: SearchComponent,
  },
  {
    path: 'error',
    // component: ErrorComponent,
    // implement lazy loading
    loadComponent: () =>
      import('./error/error.component').then((mod) => mod.ErrorComponent),
  },
  {
    path: '**',
    // component: NotFoundComponent,
    loadComponent: () =>
      import('./not-found/not-found.component').then(
        (mod) => mod.NotFoundComponent
      ),
  },
];
