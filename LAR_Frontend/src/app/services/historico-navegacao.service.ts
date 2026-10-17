import { Injectable, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HistoricoNavegacaoService {
  private readonly router = inject(Router);

  private navegacoesConcluidas = 0;

  constructor() {
    this.router.events
      .pipe(filter((evento) => evento instanceof NavigationEnd))
      .subscribe(() => {
        this.navegacoesConcluidas++;
      });
  }

  possuiHistorico(): boolean {
    return this.navegacoesConcluidas > 1;
  }
}
