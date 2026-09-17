import { Component, OnDestroy } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { Subject, filter, takeUntil } from 'rxjs';
import { AuthService, TipoUsuario } from '../../services/auth.service';
import { AvisoAuthService } from '../../services/aviso-auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnDestroy {
  menuAberto = false;
  tipoUsuario: TipoUsuario | null = null;
  carregandoLogout = false;
  mostrarNavbar = true;
  mensagemFavoritos = '';

  private readonly destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private authService: AuthService,
    private avisoAuthService: AvisoAuthService,
  ) {
    this.atualizarEstado();

    this.avisoAuthService.mensagem$
      .pipe(takeUntil(this.destroy$))
      .subscribe((mensagem) => {
        this.mensagemFavoritos = mensagem;
      });

    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntil(this.destroy$),
      )
      .subscribe(() => {
        this.atualizarEstado();
        this.fecharMenu();
      });
  }

  private atualizarEstado(): void {
    this.atualizarPerfil();
    const caminhoAtual = this.router.url.split('?')[0];
    this.mostrarNavbar = !this.ehTelaInicial(caminhoAtual);
  }

  private atualizarPerfil(): void {
    const perfil = this.authService.obterPerfil();
    this.tipoUsuario = perfil?.tipo ?? null;
  }

  private ehTelaInicial(url: string): boolean {
    return (
      url === '/' ||
      url === '/entrada' ||
      url === '/login' ||
      url === '/cadastro' ||
      url === '/cadastro-ong' ||
      url === '/recuperar-senha'
    );
  }

  estaAutenticado(): boolean {
    return this.authService.estaAutenticado();
  }

  ehAdotante(): boolean {
    return this.tipoUsuario === 'ADOTANTE';
  }

  ehOng(): boolean {
    return this.tipoUsuario === 'ONG';
  }

  ehAdministrador(): boolean {
    return this.tipoUsuario === 'ADMINISTRADOR';
  }

  alternarMenu(): void {
    this.menuAberto = !this.menuAberto;
    this.avisoAuthService.fechar();
  }

  fecharMenu(): void {
    this.menuAberto = false;
  }

  acessarFavoritos(): void {
    this.avisoAuthService.fechar();

    if (this.estaAutenticado()) {
      this.router.navigate(['/favoritos']);
      return;
    }

    this.avisoAuthService.mostrar(
      'Você precisa estar logado como Adotante para acessar seus favoritos.',
    );
  }

  fecharAviso(): void {
    this.avisoAuthService.fechar();
  }

  sair(): void {
    if (this.carregandoLogout) {
      return;
    }

    this.carregandoLogout = true;

    this.authService.logout().subscribe({
      next: () => {
        this.finalizarLogout();
      },
      error: (erro: unknown) => {
        console.error('Erro ao realizar logout:', erro);
        this.finalizarLogout();
      },
    });
  }

  private finalizarLogout(): void {
    this.authService.limparToken();
    this.tipoUsuario = null;
    this.menuAberto = false;
    this.carregandoLogout = false;
    this.avisoAuthService.fechar();
    this.router.navigate(['/']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
