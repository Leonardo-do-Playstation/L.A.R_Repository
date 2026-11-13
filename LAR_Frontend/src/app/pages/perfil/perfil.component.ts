import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';

import { AuthService, TipoUsuario } from '../../services/auth.service';
import { ContaService, PerfilDetalhe } from '../../services/conta.service';
import { BotaoVoltarComponent } from '../../components/botao-voltar/botao-voltar.component';
import { MensagemEstadoComponent } from '../../components/mensagem-estado/mensagem-estado.component';
import { FotoOngComponent } from '../../components/foto-ong/foto-ong.component';
import { IndicadorSenhaComponent } from '../../components/indicador-senha/indicador-senha.component';
import { ConfirmacaoModalService } from '../../services/confirmacao-modal.service';
import { senhaForte } from '../../validators/senha-forte.validator';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

function senhasIguais(grupo: AbstractControl): ValidationErrors | null {
  const nova = grupo.get('novaSenha')?.value;
  const confirmacao = grupo.get('confirmarNovaSenha')?.value;

  return nova === confirmacao ? null : { senhasDiferentes: true };
}

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    BotaoVoltarComponent,
    MensagemEstadoComponent,
    FotoOngComponent,
    IndicadorSenhaComponent,
    NgxMaskDirective,
  ],
  providers: [provideNgxMask()],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css',
})
export class PerfilComponent implements OnInit {
  private readonly contaService = inject(ContaService);
  private readonly confirmacaoService = inject(ConfirmacaoModalService);
  private readonly authService = inject(AuthService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);

  tipo: TipoUsuario | null = this.authService.obterPerfil()?.tipo ?? null;

  perfil: PerfilDetalhe | null = null;

  carregando = true;
  erroCarregar = '';

  editando = false;
  salvandoPerfil = false;
  erroPerfil = '';
  sucessoPerfil = '';

  mostrarEmail = false;
  salvandoEmail = false;
  erroEmail = '';
  sucessoEmail = '';

  mostrarSenha = false;
  salvandoSenha = false;
  erroSenha = '';
  sucessoSenha = '';

  mostrarExclusao = false;
  excluindo = false;
  erroExclusao = '';
  mensagemExclusaoOng = '';

  formPerfil = this.formBuilder.group({
    nome: ['', [Validators.required, Validators.maxLength(120)]],
    telefone: [''],
    endereco: [''],
    observacoes: [''],
  });

  formEmail = this.formBuilder.group({
    novoEmail: ['', [Validators.required, Validators.email]],
    senha: ['', Validators.required],
  });

  formSenha = this.formBuilder.group(
    {
      senhaAtual: ['', Validators.required],
      novaSenha: ['', [Validators.required, senhaForte]],
      confirmarNovaSenha: ['', Validators.required],
    },
    { validators: senhasIguais },
  );

  formExclusao = this.formBuilder.group({
    senha: ['', Validators.required],
  });

  get ehOng(): boolean {
    return this.tipo === 'ONG';
  }

  get ongPendente(): boolean {
    return (
      this.ehOng && this.authService.obterPerfil()?.statusOng === 'PENDENTE'
    );
  }

  get podeExcluirConta(): boolean {
    return this.tipo !== 'ADMINISTRADOR';
  }

  get rotuloTipo(): string {
    switch (this.tipo) {
      case 'ADOTANTE':
        return 'Adotante';
      case 'ONG':
        return 'ONG';
      default:
        return 'Administrador';
    }
  }

  get documento(): { rotulo: string; valor: string } | null {
    if (this.perfil?.cpf) {
      return { rotulo: 'CPF', valor: this.perfil.cpf };
    }

    if (this.perfil?.cnpj) {
      return { rotulo: 'CNPJ', valor: this.perfil.cnpj };
    }

    if (this.perfil?.codigoAdmin) {
      return {
        rotulo: 'Código de administrador',
        valor: this.perfil.codigoAdmin,
      };
    }

    return null;
  }

  ngOnInit(): void {
    this.carregarPerfil();
  }

  carregarPerfil(): void {
    if (!this.tipo) {
      this.router.navigate(['/login']);
      return;
    }

    this.carregando = true;
    this.erroCarregar = '';

    this.contaService.buscarPerfil(this.tipo).subscribe({
      next: (perfil) => {
        this.perfil = perfil;
        this.carregando = false;
      },

      error: () => {
        this.carregando = false;
        this.erroCarregar = 'Não foi possível carregar seu perfil.';
      },
    });
  }

  iniciarEdicao(): void {
    if (!this.perfil) {
      return;
    }

    this.formPerfil.reset({
      nome: this.perfil.nome,
      telefone: this.perfil.telefone ?? '',
      endereco: this.perfil.endereco ?? '',
      observacoes: this.perfil.observacoes ?? '',
    });

    this.erroPerfil = '';
    this.sucessoPerfil = '';
    this.editando = true;
  }

  async cancelarEdicao(): Promise<void> {
    if (this.formPerfil.dirty) {
      const confirmado = await this.confirmacaoService.confirmar(
        'Você tem alterações não salvas no perfil. Deseja descartá-las?',
      );

      if (!confirmado) {
        return;
      }
    }

    this.editando = false;
    this.erroPerfil = '';
    this.formPerfil.reset();
  }

  salvarPerfil(): void {
    if (this.formPerfil.invalid || !this.tipo || this.salvandoPerfil) {
      this.formPerfil.markAllAsTouched();
      return;
    }

    const valores = this.formPerfil.getRawValue();

    this.salvandoPerfil = true;
    this.erroPerfil = '';
    this.sucessoPerfil = '';

    this.contaService
      .atualizarPerfil(this.tipo, {
        nome: (valores.nome ?? '').trim(),
        telefone: (valores.telefone ?? '').trim() || null,
        endereco: (valores.endereco ?? '').trim() || null,
        ...(this.ehOng
          ? { observacoes: (valores.observacoes ?? '').trim() || null }
          : {}),
      })
      .subscribe({
        next: (perfilAtualizado) => {
          this.perfil = perfilAtualizado;
          this.salvandoPerfil = false;
          this.editando = false;
          this.sucessoPerfil = 'Perfil atualizado com sucesso.';
          this.atualizarNomeNoCache(perfilAtualizado.nome);
        },

        error: (erro: HttpErrorResponse) => {
          this.salvandoPerfil = false;
          this.erroPerfil = this.mensagemErro(
            erro,
            'Não foi possível atualizar o perfil.',
          );
        },
      });
  }

  aoAlterarFoto(foto: string | null): void {
    if (this.perfil) {
      this.perfil = { ...this.perfil, foto };
    }
  }

  private atualizarNomeNoCache(nome: string): void {
    const cache = this.authService.obterPerfil();

    if (cache) {
      this.authService.salvarPerfil({ ...cache, nome });
    }
  }

  alternarEmail(): void {
    this.mostrarEmail = !this.mostrarEmail;
    this.formEmail.reset();
    this.erroEmail = '';
    this.sucessoEmail = '';
  }

  solicitarTrocaEmail(): void {
    if (this.formEmail.invalid || this.salvandoEmail) {
      this.formEmail.markAllAsTouched();
      return;
    }

    const { novoEmail, senha } = this.formEmail.getRawValue();
    const emailNovo = (novoEmail ?? '').trim();

    if (emailNovo.toLowerCase() === (this.perfil?.email ?? '').toLowerCase()) {
      this.erroEmail = 'O novo e-mail deve ser diferente do atual.';
      return;
    }

    this.salvandoEmail = true;
    this.erroEmail = '';
    this.sucessoEmail = '';

    this.contaService.solicitarTrocaEmail(emailNovo, senha ?? '').subscribe({
      next: () => {
        this.salvandoEmail = false;
        this.mostrarEmail = false;
        this.formEmail.reset();
        this.sucessoEmail =
          'Enviamos um link de confirmação para o seu e-mail atual (válido por 15 minutos). Seu e-mail só muda depois de confirmar.';
      },

      error: (erro: HttpErrorResponse) => {
        this.salvandoEmail = false;
        this.erroEmail = this.mensagemErro(
          erro,
          'Não foi possível solicitar a troca de e-mail.',
        );
      },
    });
  }

  alternarSenha(): void {
    this.mostrarSenha = !this.mostrarSenha;
    this.formSenha.reset();
    this.erroSenha = '';
    this.sucessoSenha = '';
  }

  salvarSenha(): void {
    if (this.formSenha.invalid || this.salvandoSenha) {
      this.formSenha.markAllAsTouched();
      return;
    }

    const { senhaAtual, novaSenha } = this.formSenha.getRawValue();

    this.salvandoSenha = true;
    this.erroSenha = '';
    this.sucessoSenha = '';

    this.contaService
      .alterarSenha(senhaAtual ?? '', novaSenha ?? '')
      .subscribe({
        next: () => {
          this.salvandoSenha = false;
          this.mostrarSenha = false;
          this.formSenha.reset();
          this.sucessoSenha = 'Senha alterada com sucesso.';
        },

        error: (erro: HttpErrorResponse) => {
          this.salvandoSenha = false;
          this.erroSenha = this.mensagemErro(
            erro,
            'Não foi possível alterar a senha.',
          );
        },
      });
  }

  alternarExclusao(): void {
    this.mostrarExclusao = !this.mostrarExclusao;
    this.formExclusao.reset();
    this.erroExclusao = '';
    this.mensagemExclusaoOng = '';
  }

  confirmarExclusao(): void {
    if (this.formExclusao.invalid || this.excluindo) {
      this.formExclusao.markAllAsTouched();
      return;
    }

    this.excluindo = true;
    this.erroExclusao = '';

    this.contaService
      .solicitarExclusao(this.formExclusao.getRawValue().senha ?? '')
      .subscribe({
        next: () => {
          this.excluindo = false;

          if (this.ehOng) {
            this.formExclusao.reset();
            this.mensagemExclusaoOng =
              'Enviamos um e-mail com um link de confirmação (válido por 15 minutos). Sua conta continua ativa até você confirmar.';
            return;
          }

          this.authService.limparToken();
          this.router.navigate(['/']);
        },

        error: (erro: HttpErrorResponse) => {
          this.excluindo = false;
          this.erroExclusao = this.mensagemErro(
            erro,
            'Não foi possível excluir a conta.',
          );
        },
      });
  }

  private mensagemErro(erro: HttpErrorResponse, padrao: string): string {
    const campos = erro.error?.campos as Record<string, string> | undefined;

    if (campos && Object.keys(campos).length > 0) {
      return Object.values(campos).join(' ');
    }

    return erro.error?.mensagem ?? padrao;
  }
}
