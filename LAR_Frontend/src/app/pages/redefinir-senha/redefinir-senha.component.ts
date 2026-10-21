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

function senhasIguais(form: AbstractControl): ValidationErrors | null {
  const senha = form.get('novaSenha')?.value;
  const confirmar = form.get('confirmarSenha')?.value;

  return senha === confirmar ? null : { senhasDiferentes: true };
}

@Component({
  selector: 'app-redefinir-senha',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './redefinir-senha.component.html',
  styleUrl: './redefinir-senha.component.css',
})
export class RedefinirSenhaComponent implements OnInit {
  redefinirForm = this.formBuilder.group(
    {
      novaSenha: ['', [Validators.required, Validators.minLength(6)]],
      confirmarSenha: ['', [Validators.required]],
    },
    { validators: senhasIguais },
  );

  token = '';
  carregando = false;
  concluido = false;
  mensagemErro = '';

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

          this.mensagemErro =
            erro.error?.mensagem ||
            'Não foi possível redefinir a senha. Solicite um novo link.';
        },
      });
  }
}