import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export type StatusAnimal = 'DISPONIVEL' | 'ADOTADO' | 'EM_TRATAMENTO';

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
  status: StatusAnimal;
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

const RACAS_SUGERIDAS: Record<string, string[]> = {
  Cachorro: [
    'SRD / Vira-lata',
    'Beagle',
    'Border Collie',
    'Boxer',
    'Bulldog Francês',
    'Bulldog Inglês',
    'Chihuahua',
    'Cocker Spaniel',
    'Dachshund',
    'Golden Retriever',
    'Husky Siberiano',
    'Labrador',
    'Lhasa Apso',
    'Maltês',
    'Pastor Alemão',
    'Pinscher',
    'Pit Bull',
    'Poodle',
    'Pug',
    'Rottweiler',
    'Shih Tzu',
    'Spitz Alemão',
    'Yorkshire',
  ],
  Gato: [
    'SRD / Vira-lata',
    'Abissínio',
    'Angorá',
    'Bengal',
    'Birmanês',
    'British Shorthair',
    'Himalaio',
    'Maine Coon',
    'Norueguês da Floresta',
    'Persa',
    'Ragdoll',
    'Scottish Fold',
    'Siamês',
    'Sphynx',
  ],
};

const SEM_SUGESTOES: string[] = [];

export function racasPorEspecie(especie: string | null | undefined): string[] {
  return (especie && RACAS_SUGERIDAS[especie]) || SEM_SUGESTOES;
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

  alterarStatus(id: number, status: StatusAnimal): Observable<Animal> {
    return this.http.patch<Animal>(`${this.apiUrl}/${id}/status`, { status });
  }
}
