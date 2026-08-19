import { Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { SobreComponent } from './pages/sobre/sobre.component';
import { PainelAnimaisComponent } from './pages/painel-animais/painel-animais.component';

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
    path: 'painel-animais',
    component: PainelAnimaisComponent,
  },
];
