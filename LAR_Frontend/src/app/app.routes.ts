import { Routes } from '@angular/router';

import { EntradaComponent } from './pages/entrada/entrada.component';
import { HomeComponent } from './pages/home/home.component';
import { SobreComponent } from './pages/sobre/sobre.component';
import { CadastroComponent } from './pages/cadastro/cadastro.component';
import { LoginComponent } from './pages/login/login.component';
import { RecuperarSenhaComponent } from './pages/recuperar-senha/recuperar-senha.component';

import { guestGuard } from './services/guest.guard';
import { authGuard } from './services/auth.guard';
import { perfilGuard } from './services/perfil.guard';
import { ongPendenteGuard } from './services/ong-pendente.guard';

export const routes: Routes = [
  {
    path: '',
    component: EntradaComponent,
    canActivate: [guestGuard],
  },

  {
    path: 'adotante',
    loadComponent: () =>
      import('./pages/opcoes-acesso/opcoes-acesso.component').then(
        (m) => m.OpcoesAcessoComponent,
      ),
    canActivate: [guestGuard],
    data: {
      tipo: 'adotante',
    },
  },

  {
    path: 'ong',
    loadComponent: () =>
      import('./pages/opcoes-acesso/opcoes-acesso.component').then(
        (m) => m.OpcoesAcessoComponent,
      ),
    canActivate: [guestGuard],
    data: {
      tipo: 'ong',
    },
  },

  {
    path: 'cadastro',
    component: CadastroComponent,
    canActivate: [guestGuard],
    data: {
      tipo: 'adotante',
    },
  },

  {
    path: 'cadastro-ong',
    component: CadastroComponent,
    canActivate: [guestGuard],
    data: {
      tipo: 'ong',
    },
  },

  {
    path: 'login',
    component: LoginComponent,
    canActivate: [guestGuard],
  },

  {
    path: 'recuperar-senha',
    component: RecuperarSenhaComponent,
    canActivate: [guestGuard],
  },

  {
    path: 'home',
    component: HomeComponent,
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
    canActivate: [perfilGuard(['ONG'])],
  },

  {
    path: 'cadastro-animal',
    loadComponent: () =>
      import('./pages/cadastro-animal/cadastro-animal.component').then(
        (m) => m.CadastroAnimalComponent,
      ),
    canActivate: [perfilGuard(['ONG'])],
  },

  {
    path: 'editar-animal/:id',
    loadComponent: () =>
      import('./pages/editar-animal/editar-animal.component').then(
        (m) => m.EditarAnimalComponent,
      ),
    canActivate: [perfilGuard(['ONG'])],
  },

  {
    path: 'admin/ongs-pendentes',
    loadComponent: () =>
      import('./pages/solicitacoes-cadastro/solicitacoes-cadastro.component').then(
        (m) => m.SolicitacoesCadastroComponent,
      ),
    canActivate: [perfilGuard(['ADMINISTRADOR'])],
  },

  {
    path: 'admin/ongs-pendentes/:id',
    loadComponent: () =>
      import('./pages/analise-ong/analise-ong.component').then(
        (m) => m.AnaliseOngComponent,
      ),
    canActivate: [perfilGuard(['ADMINISTRADOR'])],
  },

  {
    path: 'admin/usuarios',
    loadComponent: () =>
      import('./pages/usuarios-admin/usuarios-admin.component').then(
        (m) => m.UsuariosAdminComponent,
      ),
    canActivate: [perfilGuard(['ADMINISTRADOR'])],
  },

  {
    path: 'admin/usuarios/:id',
    loadComponent: () =>
      import('./pages/detalhe-usuario-admin/detalhe-usuario-admin.component').then(
        (m) => m.DetalheUsuarioAdminComponent,
      ),
    canActivate: [perfilGuard(['ADMINISTRADOR'])],
  },

  {
    path: 'ongs',
    loadComponent: () =>
      import('./pages/lista-ongs/lista-ongs.component').then(
        (m) => m.ListaOngsComponent,
      ),
  },

  {
    path: 'ongs/:id',
    loadComponent: () =>
      import('./pages/detalhe-ong/detalhe-ong.component').then(
        (m) => m.DetalheOngComponent,
      ),
  },

  {
    path: 'catalogo',
    loadComponent: () =>
      import('./pages/catalogo-animais/catalogo-animais.component').then(
        (m) => m.CatalogoAnimaisComponent,
      ),
  },

  {
    path: 'animais/:id',
    loadComponent: () =>
      import('./pages/detalhe-animal/detalhe-animal.component').then(
        (m) => m.DetalheAnimalComponent,
      ),
  },

  {
    path: 'favoritos',
    loadComponent: () =>
      import('./pages/favoritos/favoritos.component').then(
        (m) => m.FavoritosComponent,
      ),
    canActivate: [perfilGuard(['ADOTANTE'])],
  },

  {
    path: 'perfil',
    loadComponent: () =>
      import('./pages/perfil/perfil.component').then((m) => m.PerfilComponent),
    canActivate: [authGuard],
  },

  {
    path: 'confirmar-exclusao',
    loadComponent: () =>
      import('./pages/confirmar-exclusao/confirmar-exclusao.component').then(
        (m) => m.ConfirmarExclusaoComponent,
      ),
  },

  {
    path: 'confirmar-email',
    loadComponent: () =>
      import('./pages/confirmar-email/confirmar-email.component').then(
        (m) => m.ConfirmarEmailComponent,
      ),
  },

  {
    path: 'aguardando-aprovacao',
    loadComponent: () =>
      import('./pages/aguardando-aprovacao/aguardando-aprovacao.component').then(
        (m) => m.AguardandoAprovacaoComponent,
      ),
    canActivate: [ongPendenteGuard],
  },

  {
    path: 'acesso-negado',
    loadComponent: () =>
      import('./pages/acesso-negado/acesso-negado.component').then(
        (m) => m.AcessoNegadoComponent,
      ),
  },
];
