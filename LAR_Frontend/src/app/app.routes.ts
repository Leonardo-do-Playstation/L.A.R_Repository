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
    title: 'L.A.R.',
    component: EntradaComponent,
    canActivate: [guestGuard],
  },

  {
    path: 'adotante',
    title: 'Acesso do adotante | L.A.R.',
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
    title: 'Acesso da ONG | L.A.R.',
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
    title: 'Cadastro de adotante | L.A.R.',
    component: CadastroComponent,
    canActivate: [guestGuard],
    data: {
      tipo: 'adotante',
    },
  },

  {
    path: 'cadastro-ong',
    title: 'Cadastro de ONG | L.A.R.',
    component: CadastroComponent,
    canActivate: [guestGuard],
    data: {
      tipo: 'ong',
    },
  },

  {
    path: 'login',
    title: 'Entrar | L.A.R.',
    component: LoginComponent,
    canActivate: [guestGuard],
  },

  {
    path: 'recuperar-senha',
    title: 'Recuperar senha | L.A.R.',
    component: RecuperarSenhaComponent,
    canActivate: [guestGuard],
  },

  {
    path: 'redefinir-senha',
    title: 'Redefinir senha | L.A.R.',
    loadComponent: () =>
      import('./pages/redefinir-senha/redefinir-senha.component').then(
        (m) => m.RedefinirSenhaComponent,
      ),
  },

  {
    path: 'home',
    title: 'Início | L.A.R.',
    component: HomeComponent,
  },

  {
    path: 'sobre',
    title: 'Sobre | L.A.R.',
    component: SobreComponent,
  },

  {
    path: 'painel-animais',
    title: 'Meus animais | L.A.R.',
    loadComponent: () =>
      import('./pages/painel-animais/painel-animais.component').then(
        (m) => m.PainelAnimaisComponent,
      ),
    canActivate: [perfilGuard(['ONG'])],
  },

  {
    path: 'cadastro-animal',
    title: 'Cadastrar animal | L.A.R.',
    loadComponent: () =>
      import('./pages/cadastro-animal/cadastro-animal.component').then(
        (m) => m.CadastroAnimalComponent,
      ),
    canActivate: [perfilGuard(['ONG'])],
  },

  {
    path: 'editar-animal/:id',
    title: 'Editar animal | L.A.R.',
    loadComponent: () =>
      import('./pages/editar-animal/editar-animal.component').then(
        (m) => m.EditarAnimalComponent,
      ),
    canActivate: [perfilGuard(['ONG'])],
  },

  {
    path: 'admin/ongs-pendentes',
    title: 'Solicitações de cadastro | L.A.R.',
    loadComponent: () =>
      import('./pages/solicitacoes-cadastro/solicitacoes-cadastro.component').then(
        (m) => m.SolicitacoesCadastroComponent,
      ),
    canActivate: [perfilGuard(['ADMINISTRADOR'])],
  },

  {
    path: 'admin/ongs-pendentes/:id',
    title: 'Análise de ONG | L.A.R.',
    loadComponent: () =>
      import('./pages/analise-ong/analise-ong.component').then(
        (m) => m.AnaliseOngComponent,
      ),
    canActivate: [perfilGuard(['ADMINISTRADOR'])],
  },

  {
    path: 'admin/usuarios',
    title: 'Gestão de usuários | L.A.R.',
    loadComponent: () =>
      import('./pages/usuarios-admin/usuarios-admin.component').then(
        (m) => m.UsuariosAdminComponent,
      ),
    canActivate: [perfilGuard(['ADMINISTRADOR'])],
  },

  {
    path: 'admin/usuarios/:id',
    title: 'Detalhes do usuário | L.A.R.',
    loadComponent: () =>
      import('./pages/detalhe-usuario-admin/detalhe-usuario-admin.component').then(
        (m) => m.DetalheUsuarioAdminComponent,
      ),
    canActivate: [perfilGuard(['ADMINISTRADOR'])],
  },

  {
    path: 'ongs',
    title: 'ONGs parceiras | L.A.R.',
    loadComponent: () =>
      import('./pages/lista-ongs/lista-ongs.component').then(
        (m) => m.ListaOngsComponent,
      ),
  },

  {
    path: 'ongs/:id',
    title: 'Detalhes da ONG | L.A.R.',
    loadComponent: () =>
      import('./pages/detalhe-ong/detalhe-ong.component').then(
        (m) => m.DetalheOngComponent,
      ),
  },

  {
    path: 'catalogo',
    title: 'Animais para adoção | L.A.R.',
    loadComponent: () =>
      import('./pages/catalogo-animais/catalogo-animais.component').then(
        (m) => m.CatalogoAnimaisComponent,
      ),
  },

  {
    path: 'animais/:id',
    title: 'Detalhes do animal | L.A.R.',
    loadComponent: () =>
      import('./pages/detalhe-animal/detalhe-animal.component').then(
        (m) => m.DetalheAnimalComponent,
      ),
  },

  {
    path: 'favoritos',
    title: 'Favoritos | L.A.R.',
    loadComponent: () =>
      import('./pages/favoritos/favoritos.component').then(
        (m) => m.FavoritosComponent,
      ),
    canActivate: [perfilGuard(['ADOTANTE'])],
  },

  {
    path: 'perfil',
    title: 'Meu perfil | L.A.R.',
    loadComponent: () =>
      import('./pages/perfil/perfil.component').then((m) => m.PerfilComponent),
    canActivate: [authGuard],
  },

  {
    path: 'confirmar-exclusao',
    title: 'Confirmar exclusão da conta | L.A.R.',
    loadComponent: () =>
      import('./pages/confirmar-exclusao/confirmar-exclusao.component').then(
        (m) => m.ConfirmarExclusaoComponent,
      ),
  },

  {
    path: 'confirmar-email',
    title: 'Confirmar e-mail | L.A.R.',
    loadComponent: () =>
      import('./pages/confirmar-email/confirmar-email.component').then(
        (m) => m.ConfirmarEmailComponent,
      ),
  },

  {
    path: 'aguardando-aprovacao',
    title: 'Aguardando aprovação | L.A.R.',
    loadComponent: () =>
      import('./pages/aguardando-aprovacao/aguardando-aprovacao.component').then(
        (m) => m.AguardandoAprovacaoComponent,
      ),
    canActivate: [ongPendenteGuard],
  },

  {
    path: 'acesso-negado',
    title: 'Acesso negado | L.A.R.',
    loadComponent: () =>
      import('./pages/acesso-negado/acesso-negado.component').then(
        (m) => m.AcessoNegadoComponent,
      ),
  },
];
