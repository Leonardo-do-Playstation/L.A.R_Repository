import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

import { AuthService, TipoUsuario } from '../../services/auth.service';
import {
  AtualizarUsuarioAdmin,
  UsuarioAdmin,
  UsuarioAdminService,
} from '../../services/usuario-admin.service';
import { BotaoVoltarComponent } from '../../components/botao-voltar/botao-voltar.component';
import { MensagemEstadoComponent } from '../../components/mensagem-estado/mensagem-estado.component';
import { ConfirmacaoModalService } from '../../services/confirmacao-modal.service';

@Component({
  selector: 'app-detalhe-usuario-admin',
  standalone: true,
  imports: [ReactiveFormsModule, BotaoVoltarComponent, MensagemEstadoComponent],
  templateUrl: './detalhe-usuario-admin.component.html',
  styleUrl: './detalhe-usuario-admin.component.css',
})
export class DetalheUsuarioAdminComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly usuarioAdminService = inject(UsuarioAdminService);
  private readonly confirmacaoService = inject(ConfirmacaoModalService);

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

  mostrarJustificativa = false;
  erroJustificativa = '';

  readonly formulario = this.fb.nonNullable.group({
    documento: ['', Validators.required],
  });

  readonly justificativa = this.fb.nonNullable.control('', Validators.required);

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

  get podeEditarDocumento(): boolean {
    return this.usuario?.tipo === 'ADOTANTE' || this.usuario?.tipo === 'ONG';
  }

  get rotuloDocumento(): string {
    return this.usuario?.tipo === 'ONG' ? 'CNPJ' : 'CPF';
  }

  private get documentoAtual(): string {
    const usuario = this.usuario;

    if (!usuario) {
      return '';
    }

    return (usuario.tipo === 'ONG' ? usuario.cnpj : usuario.cpf) ?? '';
  }

  abrirEdicao(): void {
    if (!this.usuario || !this.podeEditarDocumento) {
      return;
    }

    this.formulario.reset({
      documento: this.documentoAtual,
    });

    this.erroEdicao = '';
    this.mensagemSucesso = '';
    this.editando = true;
  }

  async cancelarEdicao(): Promise<void> {
    if (this.formulario.dirty) {
      const confirmado = await this.confirmacaoService.confirmar(
        `Você tem alterações não salvas no ${this.rotuloDocumento}. Deseja descartá-las?`,
      );

      if (!confirmado) {
        return;
      }
    }

    this.editando = false;
    this.erroEdicao = '';
    this.formulario.reset({ documento: this.documentoAtual });
  }

  salvar(): void {
    if (!this.usuario) {
      return;
    }

    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    const documento = this.formulario.getRawValue().documento.trim();

    if (!documento || documento === this.documentoAtual) {
      this.erroEdicao = `Informe um ${this.rotuloDocumento} diferente do atual.`;
      return;
    }

    this.erroEdicao = '';
    this.erroJustificativa = '';
    this.justificativa.reset('');
    this.mostrarJustificativa = true;
  }

  cancelarJustificativa(): void {
    if (this.salvando) {
      return;
    }

    this.mostrarJustificativa = false;
    this.erroJustificativa = '';
  }

  confirmarTroca(): void {
    if (!this.usuario) {
      return;
    }

    const motivo = this.justificativa.value.trim();

    if (!motivo) {
      this.justificativa.markAsTouched();
      return;
    }

    const documento = this.formulario.getRawValue().documento.trim();
    const rotulo = this.rotuloDocumento;

    const dados: AtualizarUsuarioAdmin = { justificativa: motivo };

    if (this.usuario.tipo === 'ONG') {
      dados.cnpj = documento;
    } else {
      dados.cpf = documento;
    }

    this.salvando = true;
    this.erroJustificativa = '';

    this.usuarioAdminService.editar(this.usuario.id, dados).subscribe({
      next: (usuario) => {
        this.usuario = usuario;
        this.salvando = false;
        this.editando = false;
        this.mostrarJustificativa = false;
        this.mensagemSucesso = `${rotulo} atualizado com sucesso.`;
      },

      error: (erro: HttpErrorResponse) => {
        this.salvando = false;
        this.erroJustificativa = this.mensagemDoErro(
          erro,
          `Não foi possível atualizar o ${rotulo}.`,
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

  private mensagemDoErro(erro: HttpErrorResponse, padrao: string): string {
    const campos = erro.error?.campos as Record<string, string> | undefined;

    if (campos) {
      return Object.values(campos).join(' ');
    }

    return erro.error?.mensagem ?? padrao;
  }
}
