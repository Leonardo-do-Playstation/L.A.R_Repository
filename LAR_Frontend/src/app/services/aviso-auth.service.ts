import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AvisoAuthService {
  private readonly mensagemSubject = new BehaviorSubject<string>('');

  readonly mensagem$ = this.mensagemSubject.asObservable();

  mostrar(mensagem: string): void {
    this.mensagemSubject.next(mensagem);
  }

  fechar(): void {
    this.mensagemSubject.next('');
  }
}