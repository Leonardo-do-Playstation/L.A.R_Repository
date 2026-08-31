import { Routes } from '@angular/router';

import { EntradaComponent } from './pages/entrada/entrada.component';
import { HomeComponent } from './pages/home/home.component';
import { SobreComponent } from './pages/sobre/sobre.component';
import { CadastroComponent } from './pages/cadastro/cadastro.component';
import { LoginComponent } from './pages/login/login.component';
import { RecuperarSenhaComponent } from './pages/recuperar-senha/recuperar-senha.component';

import { authGuard } from './services/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: EntradaComponent,
  },

  {
    path: 'cadastro',
    component: CadastroComponent,
    data: {
      tipo: 'adotante',
    },
  },

  {
    path: 'cadastro-ong',
    component: CadastroComponent,
    data: {
      tipo: 'ong',
    },
  },

  {
    path: 'login',
    component: LoginComponent,
  },

  {
    path: 'recuperar-senha',
    component: RecuperarSenhaComponent,
  },

  {
    path: 'home',
    component: HomeComponent,
    canActivate: [authGuard],
  },

  {
    path: 'sobre',
    component: SobreComponent,
  },
];