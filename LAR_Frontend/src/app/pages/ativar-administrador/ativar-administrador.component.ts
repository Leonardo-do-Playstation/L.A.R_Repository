import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { AdministradorService } from '../../services/administrador.service';

function senhasIguais(form: AbstractControl): ValidationErrors | null {
  const senha = form.get('senha')?.value;
  const confirmar = form.get('confirmarSenha')?.value;
  return senha === confirmar ? null : { senhasDiferentes: true };
}

@Component({
  selector: 'app-ativar-administrador',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './ativar-administrador.component.html',
  styleUrl: './ativar-administrador.component.css',
})
export class AtivarAdministradorComponent implements OnInit {
  ativarForm = this.formBuilder.group(
    {
      senha: ['', [Validators.required, Validators.minLength(8)]],
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
    private administradorService: AdministradorService,
  ) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token') ?? '';
    if (!this.token) {
      this.mensagemErro =
        'Link inválido. Peça um novo convite ao superadministrador.';
    }
  }

  ativarConta(): void {
    this.mensagemErro = '';
    if (!this.token) return;

    if (this.ativarForm.invalid) {
      this.ativarForm.markAllAsTouched();
      return;
    }

    this.carregando = true;

    this.administradorService
      .ativar({
        token: this.token,
        senha: this.ativarForm.value.senha!,
        confirmarSenha: this.ativarForm.value.confirmarSenha!,
      })
      .subscribe({
        next: () => {
          this.carregando = false;
          this.concluido = true;
        },
        error: (erro) => {
          this.carregando = false;
          this.mensagemErro =
            (erro.error?.campos ? Object.values(erro.error.campos).join(' ') : null) ||
            erro.error?.mensagem ||
            'Não foi possível ativar a conta. Peça um novo convite.';
        },
      });
  }

  alternarSenha(): void { this.mostrarSenha = !this.mostrarSenha; }
  alternarConfirmacao(): void { this.mostrarConfirmacao = !this.mostrarConfirmacao; }
}