import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { EMPTY, Subject, catchError, debounceTime, switchMap, tap } from 'rxjs';

import { OngPublica, OngService } from '../../services/ong.service';
import { BotaoVoltarComponent } from '../../components/botao-voltar/botao-voltar.component';
import { MensagemEstadoComponent } from '../../components/mensagem-estado/mensagem-estado.component';
import { SkeletonComponent } from '../../components/skeleton/skeleton.component';
import { OngAvatarComponent } from '../../components/ong-avatar/ong-avatar.component';

@Component({
  selector: 'app-lista-ongs',
  standalone: true,
  imports: [BotaoVoltarComponent, MensagemEstadoComponent, OngAvatarComponent, RouterLink, SkeletonComponent],
  templateUrl: './lista-ongs.component.html',
  styleUrl: './lista-ongs.component.css',
})
export class ListaOngsComponent implements OnInit {
  private readonly ongService = inject(OngService);
  private readonly consulta$ = new Subject<void>();

  ongs: OngPublica[] = [];

  nome = '';
  cidade = '';

  carregando = true;
  erro = '';

  get temFiltro(): boolean {
    return !!(this.nome.trim() || this.cidade.trim());
  }

  ngOnInit(): void {
    this.consulta$
      .pipe(
        debounceTime(300),
        tap(() => {
          this.carregando = true;
          this.erro = '';
        }),
        switchMap(() =>
          this.ongService.listar(this.nome, this.cidade).pipe(
            catchError((_erro: HttpErrorResponse) => {
              this.carregando = false;
              this.ongs = [];
              this.erro = 'Não foi possível carregar as ONGs.';
              return EMPTY;
            }),
          ),
        ),
      )
      .subscribe((ongs) => {
        this.ongs = ongs;
        this.carregando = false;
      });

    this.consulta$.next();
  }

  aoDigitarNome(valor: string): void {
    this.nome = valor;
    this.consulta$.next();
  }

  aoDigitarCidade(valor: string): void {
    this.cidade = valor;
    this.consulta$.next();
  }

  limparFiltros(): void {
    this.nome = '';
    this.cidade = '';
    this.consulta$.next();
  }

  inicial(nome: string): string {
    return nome.trim().charAt(0).toUpperCase();
  }
}