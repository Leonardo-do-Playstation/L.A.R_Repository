import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface OngResumo {
  id: number;
  nome: string;
  cnpj: string;
  telefone: string;
  endereco: string;
}

export interface AnimalCatalogo {
  id: number;
  nome: string;
  especie: string;
  idade: number;
  raca: string;
  sexo: string;
  porte: string;
  cor: string;
  descricao: string;
  foto: string | null;
  status: string;
  ong: OngResumo;
}

interface PaginaAnimais {
  content: AnimalCatalogo[];
  totalElements: number;
  totalPages: number;
}

export interface FiltrosCatalogo {
  especie?: string;
  raca?: string;
  porte?: string;
  cor?: string;
  sexo?: string;
  idadeMinima?: number;
  idadeMaxima?: number;
  idOng?: number;
}

export type OrdemCatalogo = 'recentes' | 'antigos';

export interface PaginaCatalogo {
  animais: AnimalCatalogo[];
  totalElementos: number;
  totalPaginas: number;
}

export const ANIMAIS_POR_PAGINA = 40;

@Injectable({
  providedIn: 'root',
})
export class CatalogoAnimaisService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'http://localhost:8080/animais';

  buscarPorId(id: number): Observable<AnimalCatalogo> {
    return this.http.get<AnimalCatalogo>(`${this.apiUrl}/${id}`);
  }

  listar(filtros: FiltrosCatalogo = {}): Observable<AnimalCatalogo[]> {
    const params = this.montarParametros(filtros, 0, 100, 'id,desc');

    return this.http
      .get<PaginaAnimais>(this.apiUrl, { params })
      .pipe(map((resultado) => resultado.content));
  }

  listarPagina(
    filtros: FiltrosCatalogo,
    pagina: number,
    ordem: OrdemCatalogo,
  ): Observable<PaginaCatalogo> {
    const params = this.montarParametros(
      filtros,
      pagina - 1,
      ANIMAIS_POR_PAGINA,
      ordem === 'recentes' ? 'id,desc' : 'id,asc',
    );

    return this.http.get<PaginaAnimais>(this.apiUrl, { params }).pipe(
      map((resultado) => ({
        animais: resultado.content,
        totalElementos: resultado.totalElements,
        totalPaginas: resultado.totalPages,
      })),
    );
  }

  private montarParametros(
    filtros: FiltrosCatalogo,
    pagina: number,
    tamanho: number,
    ordenacao: string,
  ): HttpParams {
    let params = new HttpParams()
      .set('page', pagina)
      .set('size', tamanho)
      .set('sort', ordenacao);

    if (filtros.especie) {
      params = params.set('especie', filtros.especie);
    }

    if (filtros.raca) {
      params = params.set('raca', filtros.raca);
    }

    if (filtros.porte) {
      params = params.set('porte', filtros.porte);
    }

    if (filtros.cor) {
      params = params.set('cor', filtros.cor);
    }

    if (filtros.sexo) {
      params = params.set('sexo', filtros.sexo);
    }

    if (filtros.idadeMinima != null) {
      params = params.set('idadeMinima', filtros.idadeMinima);
    }

    if (filtros.idadeMaxima != null) {
      params = params.set('idadeMaxima', filtros.idadeMaxima);
    }

    if (filtros.idOng != null) {
      params = params.set('idOng', filtros.idOng);
    }

    return params;
  }
}
