import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService, Perfil } from '../../services/auth.service';
import { BotaoVoltarComponent } from '../../components/botao-voltar/botao-voltar.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, BotaoVoltarComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  loginForm;
  erroLogin = '';
  carregando = false;
  rotaCadastro = '/cadastro';
  mostrarSenha = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params: ParamMap) => {
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
      next: (resposta: { token: string; perfil: Perfil }) => {
        this.authService.salvarToken(resposta.token);
        this.authService.salvarPerfil(resposta.perfil);
        this.carregando = false;

        const ongPendente =
          resposta.perfil.tipo === 'ONG' &&
          resposta.perfil.statusOng === 'PENDENTE';

        this.router.navigate([ongPendente ? '/aguardando-aprovacao' : '/home']);
      },
      error: (erro: HttpErrorResponse) => {
        console.error('Erro ao realizar login:', erro);
        this.carregando = false;

        if (erro.status === 403) {
          this.erroLogin =
            erro.error?.mensagem ??
            erro.error?.erro ??
            'Esta conta está suspensa. Entre em contato com o suporte.';
        } else if (erro.status === 401) {
          this.erroLogin = 'E-mail ou senha inválidos.';
        } else {
          this.erroLogin =
            'Não foi possível realizar o login. Tente novamente.';
        }
      },
    });
  }

  alternarSenha(): void {
    this.mostrarSenha = !this.mostrarSenha;
  }
}
