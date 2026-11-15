import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { senhaForte } from '../../validators/senha-forte.validator';
import { cnpjOpcional } from '../../validators/cnpj.validator';
import { IndicadorSenhaComponent } from '../../components/indicador-senha/indicador-senha.component';

import { HttpClient } from '@angular/common/http';

import { AuthService } from '../../services/auth.service';

import { BotaoVoltarComponent } from '../../components/botao-voltar/botao-voltar.component';
import { TermosComponent } from '../termos/termos.component';
import { PrivacidadeComponent } from '../privacidade/privacidade.component';
import type { FormularioComAlteracoesPendentes } from '../../services/confirmar-saida-formulario.guard';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    BotaoVoltarComponent,
    IndicadorSenhaComponent,
    TermosComponent,
    PrivacidadeComponent,
  ],
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.css',
})
export class CadastroComponent implements FormularioComAlteracoesPendentes {
  tipo: 'adotante' | 'ong';

  cadastroForm;

  erroCadastro = '';
  cadastroRealizado = false;
  carregando = false;
  mostrarSenha = false;
  mostrarConfirmacao = false;
  documentoAberto: 'termos' | 'privacidade' | null = null;

  @ViewChild('botaoFecharDocumento')
  private botaoFecharDocumento?: ElementRef<HTMLButtonElement>;

  @ViewChild('corpoDocumento')
  private corpoDocumento?: ElementRef<HTMLElement>;

  private elementoFocoAnterior: HTMLElement | null = null;

  private readonly apiUrl = 'http://localhost:8080';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private authService: AuthService,
  ) {
    this.tipo = this.route.snapshot.data['tipo'] ?? 'adotante';

    this.cadastroForm = this.formBuilder.group({
      nome: ['', Validators.required],

      nomeInstituicao: [''],

      cpf: [''],

      cnpj: ['', cnpjOpcional],

      email: ['', [Validators.required, Validators.email]],

      senha: ['', [Validators.required, senhaForte]],

      confirmarSenha: ['', Validators.required],

      aceiteTermos: [false, Validators.requiredTrue],
    });
  }

  get aceiteTermosInvalido(): boolean {
    const aceite = this.cadastroForm.controls.aceiteTermos;

    return aceite.touched && aceite.invalid;
  }

  temAlteracoesPendentes(): boolean {
    return this.cadastroForm.dirty;
  }

  cadastrar(): void {
    this.erroCadastro = '';
    this.cadastroRealizado = false;

    if (!this.validarFormulario()) {
      this.cadastroForm.markAllAsTouched();
      return;
    }

    const senha = this.cadastroForm.value.senha!;
    const confirmarSenha = this.cadastroForm.value.confirmarSenha!;

    if (senha !== confirmarSenha) {
      this.erroCadastro = 'As senhas não coincidem.';
      return;
    }

    this.carregando = true;

    if (this.tipo === 'adotante') {
      this.cadastrarAdotante();
    } else {
      this.cadastrarOng();
    }
  }

  private validarFormulario(): boolean {
    const email = this.cadastroForm.controls.email;
    const senha = this.cadastroForm.controls.senha;
    const confirmarSenha = this.cadastroForm.controls.confirmarSenha;
    const aceiteTermos = this.cadastroForm.controls.aceiteTermos;

    if (
      email.invalid ||
      senha.invalid ||
      confirmarSenha.invalid ||
      aceiteTermos.invalid
    ) {
      return false;
    }

    if (this.tipo === 'adotante') {
      return (
        !!this.cadastroForm.controls.nome.value &&
        !!this.cadastroForm.controls.cpf.value
      );
    }

    return (
      !!this.cadastroForm.controls.nomeInstituicao.value &&
      this.cadastroForm.controls.cnpj.valid
    );
  }

  private cadastrarAdotante(): void {
    const dados = {
      nome: this.cadastroForm.value.nome!,
      email: this.cadastroForm.value.email!,
      senha: this.cadastroForm.value.senha!,
      cpf: this.cadastroForm.value.cpf!,
    };

    this.http.post(`${this.apiUrl}/adotantes/cadastro`, dados).subscribe({
      next: () => {
        this.cadastroForm.markAsPristine();
        console.log('Cadastro de adotante realizado com sucesso.');

        this.loginAutomatico(dados.email, dados.senha);
      },

      error: (erro) => {
        console.error('Erro ao cadastrar adotante:', erro);

        this.tratarErroCadastro(erro);
      },
    });
  }

  private cadastrarOng(): void {
    const dados = {
      nome: this.cadastroForm.value.nomeInstituicao!,
      email: this.cadastroForm.value.email!,
      senha: this.cadastroForm.value.senha!,
      cnpj: (this.cadastroForm.value.cnpj ?? '').trim() || null,
    };

    this.http.post(`${this.apiUrl}/ongs/cadastro`, dados).subscribe({
      next: () => {
        this.cadastroForm.markAsPristine();
        console.log('Cadastro de ONG realizado com sucesso.');

        this.loginAutomatico(dados.email, dados.senha);
      },

      error: (erro) => {
        console.error('Erro ao cadastrar ONG:', erro);

        this.tratarErroCadastro(erro);
      },
    });
  }

  private loginAutomatico(email: string, senha: string): void {
    this.authService.login(email, senha).subscribe({
      next: (resposta) => {
        this.authService.salvarToken(resposta.token);
        this.authService.salvarPerfil(resposta.perfil);

        this.carregando = false;
        this.cadastroRealizado = true;

        const ongPendente =
          resposta.perfil.tipo === 'ONG' &&
          resposta.perfil.statusOng === 'PENDENTE';

        this.router.navigate([ongPendente ? '/aguardando-aprovacao' : '/home']);
      },

      error: (erro) => {
        console.error('Erro no login automático:', erro);

        this.carregando = false;

        this.erroCadastro =
          'Cadastro realizado, mas não foi possível fazer login automaticamente.';
      },
    });
  }

  private tratarErroCadastro(erro: any): void {
    this.carregando = false;

    if (erro.status === 409) {
      this.erroCadastro =
        erro.error?.mensagem ??
        erro.error?.message ??
        'E-mail ou CPF já cadastrado.';
    } else if (erro.status === 400) {
      const campos = erro.error?.campos as Record<string, string> | undefined;
      this.erroCadastro =
        (campos && Object.values(campos).join(' ')) ||
        erro.error?.mensagem ||
        'Verifique os dados informados.';
    } else {
      this.erroCadastro =
        'Não foi possível realizar o cadastro. Tente novamente.';
    }
  }

  alternarSenha(): void {
    this.mostrarSenha = !this.mostrarSenha;
  }

  alternarConfirmacao(): void {
    this.mostrarConfirmacao = !this.mostrarConfirmacao;
  }

  abrirDocumento(documento: 'termos' | 'privacidade'): void {
    if (!this.documentoAberto) {
      this.elementoFocoAnterior = document.activeElement as HTMLElement | null;
    }

    this.documentoAberto = documento;

    setTimeout(() => {
      this.corpoDocumento?.nativeElement.scrollTo({ top: 0 });
      this.botaoFecharDocumento?.nativeElement.focus();
    });
  }

  fecharDocumento(): void {
    this.documentoAberto = null;

    setTimeout(() => this.elementoFocoAnterior?.focus());
  }

  aoClicarFundoDocumento(evento: MouseEvent): void {
    if (evento.target === evento.currentTarget) {
      this.fecharDocumento();
    }
  }

  aoTeclarNoDocumento(evento: KeyboardEvent): void {
    if (evento.key !== 'Tab') {
      return;
    }

    const focaveis = Array.from(
      (evento.currentTarget as HTMLElement).querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])',
      ),
    );

    if (!focaveis.length) {
      return;
    }

    const primeiro = focaveis[0];
    const ultimo = focaveis[focaveis.length - 1];

    if (evento.shiftKey && document.activeElement === primeiro) {
      evento.preventDefault();
      ultimo.focus();
    } else if (!evento.shiftKey && document.activeElement === ultimo) {
      evento.preventDefault();
      primeiro.focus();
    }
  }

  @HostListener('document:keydown.escape')
  aoPressionarEscape(): void {
    if (this.documentoAberto) {
      this.fecharDocumento();
    }
  }
}
