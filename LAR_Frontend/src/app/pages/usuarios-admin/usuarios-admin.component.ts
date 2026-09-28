import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import {
  EMPTY,
  Subject,
  catchError,
  debounceTime,
  distinctUntilChanged,
  of,
  switchMap,
} from 'rxjs';

import { TipoUsuario } from '../../services/auth.service';
import {
  UsuarioAdmin,
  UsuarioAdminService,
} from '../../services/usuario-admin.service';

type FiltroTipo = 'TODOS' | TipoUsuario;

@Component({
  selector: 'app-usuarios-admin',
  standalone: true,
  imports: [],
  templateUrl: './usuarios-admin.component.html',
  styleUrl: './usuarios-admin.component.css',
})
export class UsuariosAdminComponent implements OnInit {
  private readonly usuarioAdminService = inject(UsuarioAdminService);
  private readonly router = inject(Router);

  private readonly termoBusca$ = new Subject<string>();

  todos: UsuarioAdmin[] = [];
  resultadoBusca: UsuarioAdmin[] | null = null;

  termo = '';
  filtroTipo: FiltroTipo = 'TODOS';

  readonly filtros: { valor: FiltroTipo; rotulo: string }[] = [
    { valor: 'TODOS', rotulo: 'Todos' },
    { valor: 'ADOTANTE', rotulo: 'Adotantes' },
    { valor: 'ONG', rotulo: 'ONGs' },
    { valor: 'ADMINISTRADOR', rotulo: 'Administradores' },
  ];

  carregando = true;
  buscando = false;
  erro = '';

  ngOnInit(): void {
    this.carregarUsuarios();

    this.termoBusca$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((termo) => {
          if (!termo) {
            this.buscando = false;
            return of(null);
          }

          this.buscando = true;
          this.erro = '';

          return this.usuarioAdminService.buscar(termo).pipe(
            catchError((erro: HttpErrorResponse) => {
              this.buscando = false;
              this.erro = this.mensagemErro(erro);
              return EMPTY;
            }),
          );
        }),
      )
      .subscribe((resultado) => {
        this.resultadoBusca = resultado;
        this.buscando = false;
      });
  }

  carregarUsuarios(): void {
    this.carregando = true;
    this.erro = '';

    this.usuarioAdminService.listarTodos().subscribe({
      next: (usuarios) => {
        this.todos = usuarios;
        this.carregando = false;
      },

      error: (erro: HttpErrorResponse) => {
        this.carregando = false;
        this.erro = this.mensagemErro(erro);
      },
    });
  }

  aoDigitarBusca(valor: string): void {
    this.termo = valor;
    this.termoBusca$.next(valor.trim());
  }

  selecionarFiltro(filtro: FiltroTipo): void {
    this.filtroTipo = filtro;
  }

  abrirUsuario(usuario: UsuarioAdmin): void {
    this.router.navigate(['/admin/usuarios', usuario.id]);
  }

  get usuariosFiltrados(): UsuarioAdmin[] {
    const usuarios = this.resultadoBusca ?? this.todos;

    if (this.filtroTipo === 'TODOS') {
      return usuarios;
    }

    return usuarios.filter((usuario) => usuario.tipo === this.filtroTipo);
  }

  rotuloTipo(tipo: TipoUsuario): string {
    switch (tipo) {
      case 'ADOTANTE':
        return 'Adotante';
      case 'ONG':
        return 'ONG';
      case 'ADMINISTRADOR':
        return 'Administrador';
    }
  }

  rotuloStatusOng(status: UsuarioAdmin['statusOng']): string {
    switch (status) {
      case 'APROVADA':
        return 'Aprovada';
      case 'RECUSADA':
        return 'Recusada';
      case 'PENDENTE':
        return 'Pendente';
      default:
        return '';
    }
  }

  get totalUsuarios(): number {
    return this.todos.length;
  }

  get totalAdotantes(): number {
    return this.todos.filter((u) => u.tipo === 'ADOTANTE').length;
  }

  get totalOngs(): number {
    return this.todos.filter((u) => u.tipo === 'ONG').length;
  }

  get totalOngsPendentes(): number {
    return this.todos.filter(
      (u) => u.tipo === 'ONG' && u.statusOng === 'PENDENTE',
    ).length;
  }

  get totalBloqueados(): number {
    return this.todos.filter((u) => u.bloqueado).length;
  }

  private mensagemErro(erro: HttpErrorResponse): string {
    if (erro.status === 401) {
      return 'Sua sessão expirou. Faça login novamente.';
    }

    if (erro.status === 403) {
      return 'Você não possui permissão para acessar esta área.';
    }

    return 'Não foi possível carregar os usuários.';
  }
}
