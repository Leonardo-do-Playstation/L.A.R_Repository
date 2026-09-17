import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { AuthService, Perfil } from '../../services/auth.service';

import { Location } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  loginForm;

  erroLogin = '';
  carregando = false;
  rotaCadastro = '/cadastro';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],

      senha: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      this.rotaCadastro =
        params.get('tipo') === 'ong' ? '/cadastro-ong' : '/cadastro';
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
        this.authService.salvarPerfil(resposta.perfil);

        this.carregando = false;

        this.router.navigateByUrl(this.rotaParaPerfil(resposta.perfil));
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

  voltar(): void {
    this.location.back();
  }

  private rotaParaPerfil(perfil: Perfil): string {
    if (perfil.tipo === 'ADMINISTRADOR') {
      return '/admin/ongs-pendentes';
    }

    if (perfil.tipo === 'ONG') {
      return perfil.statusOng === 'APROVADA'
        ? '/painel-animais'
        : '/acesso-negado?motivo=ong-' + perfil.statusOng?.toLowerCase();
    }

    return '/catalogo';
  }
}
