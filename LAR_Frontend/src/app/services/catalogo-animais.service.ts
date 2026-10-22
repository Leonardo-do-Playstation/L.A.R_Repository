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
    let params = new HttpParams()
      .set('page', 0)
      .set('size', 100)
      .set('sort', 'id,desc');

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

    return this.http
      .get<PaginaAnimais>(this.apiUrl, { params })
      .pipe(map((resultado) => resultado.content));
  }
}
