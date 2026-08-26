import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginForm;

  erroLogin = '';
  carregando = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],

      senha: ['', Validators.required],
    });
  }

  entrar(): void {
    this.erroLogin = '';

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const email = this.loginForm.value.email!;

    const senha = this.loginForm.value.senha!;

    this.carregando = true;

    this.authService.login(email, senha).subscribe({
      next: (resposta) => {
        this.authService.salvarToken(resposta.token);

        console.log('Login realizado com sucesso.');

        this.authService.obterUsuarioAutenticado().subscribe({
          next: (usuario) => {
            console.log('Usuário autenticado:', usuario);

            this.carregando = false;

            this.router.navigate(['/home']);
          },

          error: (erro) => {
            console.error(
              'Token salvo, mas não foi possível obter o usuário:',
              erro,
            );

            this.carregando = false;

            this.authService.limparToken();

            this.erroLogin =
              'Não foi possível validar sua sessão. Tente novamente.';
          },
        });
      },

      error: (erro) => {
        console.error('Erro ao realizar login:', erro);

        this.carregando = false;

        if (erro.status === 401 || erro.status === 403) {
          this.erroLogin = 'E-mail ou senha inválidos.';
        } else {
          this.erroLogin =
            'Não foi possível realizar o login. Tente novamente.';
        }
      },
    });
  }
}
