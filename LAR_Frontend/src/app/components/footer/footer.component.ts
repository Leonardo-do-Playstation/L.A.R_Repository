import { Component, OnDestroy } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { Subject, filter, takeUntil } from 'rxjs';

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

  private readonly rotasSemFooter = [
    '/',
    '/entrada',
    '/adotante',
    '/ong',
    '/login',
    '/cadastro',
    '/cadastro-ong',
    '/recuperar-senha',
  ];

  private readonly destroy$ = new Subject<void>();

  constructor(private readonly router: Router) {
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

    this.mostrarFooter = !this.rotasSemFooter.includes(rota);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
