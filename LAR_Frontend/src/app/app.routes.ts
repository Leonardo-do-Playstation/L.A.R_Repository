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

  {
    path: 'painel-animais',
    loadComponent: () =>
      import('./pages/painel-animais/painel-animais.component').then(
        (m) => m.PainelAnimaisComponent,
      ),
    canActivate: [authGuard],
  },
  {
    path: 'cadastro-animal',
    loadComponent: () =>
      import('./pages/cadastro-animal/cadastro-animal.component').then(
        (m) => m.CadastroAnimalComponent,
      ),
    canActivate: [authGuard],
  },
  {
    path: 'editar-animal/:id',
    loadComponent: () =>
      import('./pages/editar-animal/editar-animal.component').then(
        (m) => m.EditarAnimalComponent,
      ),
    canActivate: [authGuard],
  },
  {
    path: 'admin/ongs-pendentes',
    loadComponent: () =>
      import('./pages/solicitacoes-cadastro/solicitacoes-cadastro.component').then(
        (m) => m.SolicitacoesCadastroComponent,
      ),
    canActivate: [authGuard],
  },
  {
    path: 'admin/ongs-pendentes/:id',
    loadComponent: () =>
      import('./pages/analise-ong/analise-ong.component').then(
        (m) => m.AnaliseOngComponent,
      ),
    canActivate: [authGuard],
  },
];
