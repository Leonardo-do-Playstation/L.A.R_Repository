import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

import { AuthService, TipoUsuario } from '../../services/auth.service';
import {
  AtualizarUsuarioAdmin,
  UsuarioAdmin,
  UsuarioAdminService,
} from '../../services/usuario-admin.service';

@Component({
  selector: 'app-detalhe-usuario-admin',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './detalhe-usuario-admin.component.html',
  styleUrl: './detalhe-usuario-admin.component.css',
})
export class DetalheUsuarioAdminComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly usuarioAdminService = inject(UsuarioAdminService);

  usuario: UsuarioAdmin | null = null;

  carregando = true;
  naoEncontrado = false;
  erro = '';

  mensagemSucesso = '';

  editando = false;
  salvando = false;
  erroEdicao = '';

  mostrarConfirmacao = false;
  alternando = false;
  erroConfirmacao = '';

  readonly formulario = this.fb.nonNullable.group({
    nome: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    telefone: [''],
    endereco: [''],
    cnpj: [''],
  });

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = Number(params.get('id'));
      this.carregarUsuario(id);
    });
  }

  carregarUsuario(id: number): void {
    this.carregando = true;
    this.naoEncontrado = false;
    this.erro = '';
    this.editando = false;
    this.mensagemSucesso = '';

    this.usuarioAdminService.buscarPorId(id).subscribe({
      next: (usuario) => {
        this.usuario = usuario;
        this.carregando = false;
      },

      error: (erro: HttpErrorResponse) => {
        this.carregando = false;

        if (erro.status === 404) {
          this.naoEncontrado = true;
        } else {
          this.erro = 'Não foi possível carregar os dados deste usuário.';
        }
      },
    });
  }

  get ehContaPropria(): boolean {
    const perfil = this.authService.obterPerfil();

    if (!perfil || !this.usuario) {
      return false;
    }

    return perfil.email.toLowerCase() === this.usuario.email.toLowerCase();
  }

  abrirEdicao(): void {
    if (!this.usuario) {
      return;
    }

    this.formulario.reset({
      nome: this.usuario.nome,
      email: this.usuario.email,
      telefone: this.usuario.telefone ?? '',
      endereco: this.usuario.endereco ?? '',
      cnpj: this.usuario.cnpj ?? '',
    });

    this.erroEdicao = '';
    this.mensagemSucesso = '';
    this.editando = true;
  }

  cancelarEdicao(): void {
    this.editando = false;
    this.erroEdicao = '';
  }

  salvar(): void {
    if (!this.usuario) {
      return;
    }

    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    const valores = this.formulario.getRawValue();

    const dados: AtualizarUsuarioAdmin = {
      nome: valores.nome.trim(),
      email: valores.email.trim(),
      telefone: valores.telefone.trim(),
      endereco: valores.endereco.trim(),
    };

    if (this.usuario.tipo === 'ONG') {
      dados.cnpj = valores.cnpj.trim();
    }

    this.salvando = true;
    this.erroEdicao = '';

    this.usuarioAdminService.editar(this.usuario.id, dados).subscribe({
      next: (usuario) => {
        this.usuario = usuario;
        this.salvando = false;
        this.editando = false;
        this.mensagemSucesso = 'Dados atualizados com sucesso.';
      },

      error: (erro: HttpErrorResponse) => {
        this.salvando = false;
        this.erroEdicao = this.mensagemDoErro(
          erro,
          'Não foi possível salvar as alterações.',
        );
      },
    });
  }

  abrirConfirmacao(): void {
    this.erroConfirmacao = '';
    this.mostrarConfirmacao = true;
  }

  cancelarConfirmacao(): void {
    this.mostrarConfirmacao = false;
  }

  confirmarBloqueio(): void {
    if (!this.usuario) {
      return;
    }

    this.alternando = true;
    this.erroConfirmacao = '';

    this.usuarioAdminService.alternarBloqueio(this.usuario.id).subscribe({
      next: (usuario) => {
        this.usuario = usuario;
        this.alternando = false;
        this.mostrarConfirmacao = false;
        this.mensagemSucesso = usuario.bloqueado
          ? 'Usuário bloqueado com sucesso.'
          : 'Usuário desbloqueado com sucesso.';
      },

      error: (erro: HttpErrorResponse) => {
        this.alternando = false;
        this.erroConfirmacao = this.mensagemDoErro(
          erro,
          'Não foi possível alterar o bloqueio deste usuário.',
        );
      },
    });
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
        return 'Não informado';
    }
  }

  voltar(): void {
    this.router.navigate(['/admin/usuarios']);
  }

  private mensagemDoErro(erro: HttpErrorResponse, padrao: string): string {
    const campos = erro.error?.campos as Record<string, string> | undefined;

    if (campos) {
      return Object.values(campos).join(' ');
    }

    return erro.error?.mensagem ?? padrao;
  }
}
