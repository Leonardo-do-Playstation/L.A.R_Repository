import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-recuperar-senha',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './recuperar-senha.component.html',
  styleUrl: './recuperar-senha.component.css',
})
export class RecuperarSenhaComponent implements OnInit {
  recuperarForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
  });

  carregando = false;
  mensagemSucesso = '';
  mensagemErro = '';
  tokenTeste = '';
  rotaCadastro = '/cadastro';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      this.rotaCadastro =
        params.get('tipo') === 'ong' ? '/cadastro-ong' : '/cadastro';
    });
  }

  recuperarSenha(): void {
    this.mensagemSucesso = '';
    this.mensagemErro = '';
    this.tokenTeste = '';

    if (this.recuperarForm.invalid) {
      this.recuperarForm.markAllAsTouched();
      return;
    }

    const email = this.recuperarForm.value.email!;

    this.carregando = true;

    this.authService.recuperarSenha(email).subscribe({
      next: (resposta) => {
        this.carregando = false;

        this.mensagemSucesso =
          resposta.mensagem ||
          'Se este e-mail estiver cadastrado, um link de recuperação será enviado.';

        if (resposta.token_teste) {
          this.tokenTeste = resposta.token_teste;
        }

        this.recuperarForm.reset();
      },

      error: (erro) => {
        this.carregando = false;

        console.error('Erro ao solicitar recuperação de senha:', erro);

        if (erro.status === 400) {
          this.mensagemErro = 'Informe um e-mail válido.';
        } else {
          this.mensagemErro =
            'Não foi possível solicitar a recuperação da senha. Tente novamente.';
        }
      },
    });
  }
}
