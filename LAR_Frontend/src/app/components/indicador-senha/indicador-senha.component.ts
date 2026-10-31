import { Component, Input } from '@angular/core';

import { REGRAS_SENHA } from '../../validators/senha-forte.validator';

type Forca = 'vazia' | 'fraca' | 'media' | 'forte';

@Component({
  selector: 'app-indicador-senha',
  standalone: true,
  imports: [],
  templateUrl: './indicador-senha.component.html',
  styleUrl: './indicador-senha.component.css',
})
export class IndicadorSenhaComponent {
  @Input() senha: string | null = '';
  @Input() tema: 'claro' | 'escuro' = 'claro';

  readonly regras = REGRAS_SENHA;

  get valor(): string {
    return this.senha ?? '';
  }

  get cumpridas(): number {
    return this.regras.filter((regra) => regra.atende(this.valor)).length;
  }

  get forca(): Forca {
    if (!this.valor) {
      return 'vazia';
    }
    if (this.cumpridas === this.regras.length) {
      return 'forte';
    }
    return this.cumpridas >= 3 ? 'media' : 'fraca';
  }

  get rotuloForca(): string {
    switch (this.forca) {
      case 'forte':
        return 'Senha forte';
      case 'media':
        return 'Senha média';
      case 'fraca':
        return 'Senha fraca';
      default:
        return 'Digite uma senha';
    }
  }

  get porcentagem(): number {
    return (this.cumpridas / this.regras.length) * 100;
  }
}
