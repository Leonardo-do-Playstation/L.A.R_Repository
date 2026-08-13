import { Routes } from '@angular/router';

import { EntradaComponent } from './pages/entrada/entrada.component';
import { HomeComponent } from './pages/home/home.component';
import { SobreComponent } from './pages/sobre/sobre.component';

export const routes: Routes = [
  {
    path: '',
    component: EntradaComponent
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'sobre',
    component: SobreComponent
  }
];