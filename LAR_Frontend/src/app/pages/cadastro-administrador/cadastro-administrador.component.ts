import { Component, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { AdministradorService } from '../../services/administrador.service';
import { BotaoVoltarComponent } from '../../components/botao-voltar/botao-voltar.component';

@Component({
  selector: 'app-cadastro-administrador',
  standalone: true,
  imports: [ReactiveFormsModule, BotaoVoltarComponent],
  templateUrl: './cadastro-administrador.component.html',
  styleUrl: './cadastro-administrador.component.css',
})
export class CadastroAdministradorComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly administradorService = inject(AdministradorService);

  form = this.formBuilder.nonNullable.group({
    nome: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    codigoAdmin: ['', [Validators.required, Validators.minLength(3)]],
  });

  carregando = false;
  mensagemSucesso = '';
  mensagemErro = '';

  enviar(): void {
    this.mensagemSucesso = '';
    this.mensagemErro = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { nome, email, codigoAdmin } = this.form.getRawValue();

    this.carregando = true;

    this.administradorService
      .convidar({
        nome: nome.trim(),
        email: email.trim().toLowerCase(),
        codigoAdmin: codigoAdmin.trim(),
      })
      .subscribe({
        next: (resposta) => {
          this.carregando = false;
          this.mensagemSucesso =
            resposta?.mensagem ||
            'Convite enviado por e-mail. O link vale por 15 minutos.';
          this.form.reset({ nome: '', email: '', codigoAdmin: '' });
        },
        error: (erro: HttpErrorResponse) => {
          this.carregando = false;
          this.mensagemErro = this.extrairMensagem(erro);
        },
      });
  }

  campoInvalido(campo: 'nome' | 'email' | 'codigoAdmin'): boolean {
    const controle = this.form.controls[campo];
    return controle.invalid && (controle.touched || controle.dirty);
  }

  private extrairMensagem(erro: HttpErrorResponse): string {
    if (erro.status === 0) {
      return 'Não foi possível conectar ao servidor. Tente novamente.';
    }
    if (erro.status === 401) {
      return 'Sua sessão expirou. Entre novamente.';
    }
    if (erro.status === 403) {
      return (
        erro.error?.mensagem ||
        'Apenas o superadministrador pode convidar administradores.'
      );
    }
    const campos = erro.error?.campos;
    if (campos && typeof campos === 'object') {
      return Object.values(campos).join(' ');
    }
    return (
      erro.error?.mensagem ||
      'Não foi possível enviar o convite. Tente novamente.'
    );
  }
}