import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { IndicadorSenhaComponent } from '../../components/indicador-senha/indicador-senha.component';
import { senhaForte } from '../../validators/senha-forte.validator';


function senhasIguais(form: AbstractControl): ValidationErrors | null {
  const senha = form.get('novaSenha')?.value;
  const confirmar = form.get('confirmarSenha')?.value;

  return senha === confirmar ? null : { senhasDiferentes: true };
}

@Component({
  selector: 'app-redefinir-senha',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, IndicadorSenhaComponent],
  templateUrl: './redefinir-senha.component.html',
  styleUrl: './redefinir-senha.component.css',
})
export class RedefinirSenhaComponent implements OnInit {
  redefinirForm = this.formBuilder.group(
    {
      novaSenha: ['', [Validators.required, senhaForte]],
      confirmarSenha: ['', [Validators.required]],
    },
    { validators: senhasIguais },
  );

  token = '';
  carregando = false;
  concluido = false;
  mensagemErro = '';
  mostrarSenha = false;
  mostrarConfirmacao = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token') ?? '';

    if (!this.token) {
      this.mensagemErro =
        'Link inválido. Solicite a recuperação de senha novamente.';
    }
  }

  redefinirSenha(): void {
    this.mensagemErro = '';

    if (!this.token) {
      return;
    }

    if (this.redefinirForm.invalid) {
      this.redefinirForm.markAllAsTouched();
      return;
    }

    this.carregando = true;

    this.authService
      .redefinirSenha(this.token, this.redefinirForm.value.novaSenha!)
      .subscribe({
        next: () => {
          this.carregando = false;
          this.concluido = true;
        },

        error: (erro) => {
          this.carregando = false;

          const campos = erro.error?.campos as
            | Record<string, string>
            | undefined;

          this.mensagemErro =
            (campos && Object.values(campos).join(' ')) ||
            erro.error?.mensagem ||
            'Não foi possível redefinir a senha. Solicite um novo link.';
        },
      });
  }

  alternarSenha(): void {
    this.mostrarSenha = !this.mostrarSenha;
  }

  alternarConfirmacao(): void {
    this.mostrarConfirmacao = !this.mostrarConfirmacao;
  }
}
