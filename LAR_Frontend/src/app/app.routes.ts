import { Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { SobreComponent } from './pages/sobre/sobre.component';
import { RecuperarSenhaComponent } from './pages/recuperar-senha/recuperar-senha.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'sobre',
    component: SobreComponent,
  },
  {
    path: 'recuperar-senha',
    component: RecuperarSenhaComponent,
  },
];
