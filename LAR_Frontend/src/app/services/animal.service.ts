import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Animal {
  id: number;
  nome: string;
  especie: string;
  idade: number;
  raca: string;
  sexo: string;
  porte: string;
  cor?: string;
  descricao: string;
  foto?: string;
  status: string;
  idOng: number;
  nomeOng: string;
}

export interface CadastroAnimal {
  nome: string;
  especie: string;
  idade: number;
  raca: string;
  sexo: string;
  porte: string;
  cor: string;
  descricao: string;
}

@Injectable({
  providedIn: 'root',
})
export class AnimalService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'http://localhost:8080/ong/animais';

  listarMeusAnimais(): Observable<Animal[]> {
    return this.http.get<Animal[]>(this.apiUrl);
  }

  cadastrarAnimal(dados: CadastroAnimal, foto: File): Observable<Animal> {
    const formData = new FormData();

    formData.append(
      'dados',
      new Blob([JSON.stringify(dados)], { type: 'application/json' }),
    );

    formData.append('foto', foto);

    return this.http.post<Animal>(this.apiUrl, formData);
  }

  editarAnimal(
    id: number,
    dados: CadastroAnimal,
    foto: File | null,
  ): Observable<Animal> {
    const formData = new FormData();

    formData.append(
      'dados',
      new Blob([JSON.stringify(dados)], { type: 'application/json' }),
    );

    if (foto) {
      formData.append('foto', foto);
    }

    return this.http.put<Animal>(`${this.apiUrl}/${id}`, formData);
  }
  excluirAnimal(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
