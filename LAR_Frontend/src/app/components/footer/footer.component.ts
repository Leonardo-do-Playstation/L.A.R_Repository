import { Component, OnDestroy } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { Subject, filter, takeUntil } from 'rxjs';
import { AuthService, TipoUsuario } from '../../services/auth.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
})
export class FooterComponent implements OnDestroy {
  mostrarFooter = false;
  readonly anoAtual = new Date().getFullYear();

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly router: Router,
    private readonly authService: AuthService,
  ) {
    this.atualizarVisibilidade();

    this.router.events
      .pipe(
        filter((evento) => evento instanceof NavigationEnd),
        takeUntil(this.destroy$),
      )
      .subscribe(() => this.atualizarVisibilidade());
  }

  private atualizarVisibilidade(): void {
    const rota =
      this.router.url.split('?')[0].split('#')[0].replace(/\/+$/, '') || '/';
    const tipoUsuario: TipoUsuario | null =
      this.authService.obterPerfil()?.tipo ?? null;

    const rotasPublicas = [
      '/sobre',
      '/catalogo',
      '/ongs',
      '/termos',
      '/privacidade',
    ];
    const rotaDeDetalhePublico = /^\/(ongs|animais)\/[^/]+$/.test(rota);

    this.mostrarFooter =
      rotasPublicas.includes(rota) ||
      rotaDeDetalhePublico ||
      (rota === '/home' &&
        tipoUsuario !== 'ONG' &&
        tipoUsuario !== 'ADMINISTRADOR');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
