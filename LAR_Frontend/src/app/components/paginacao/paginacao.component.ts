import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-paginacao',
  standalone: true,
  imports: [],
  templateUrl: './paginacao.component.html',
  styleUrl: './paginacao.component.css',
})
export class PaginacaoComponent {
  @Input() paginaAtual = 1;
  @Input() totalPaginas = 0;

  @Output() paginaAlterada = new EventEmitter<number>();

  get itens(): (number | null)[] {
    const total = this.totalPaginas;
    const atual = this.paginaAtual;

    const numeros = [1, atual - 1, atual, atual + 1, total]
      .filter((numero) => numero >= 1 && numero <= total)
      .filter((numero, indice, lista) => lista.indexOf(numero) === indice)
      .sort((a, b) => a - b);

    const itens: (number | null)[] = [];

    numeros.forEach((numero, indice) => {
      if (indice > 0) {
        const diferenca = numero - numeros[indice - 1];

        if (diferenca === 2) {
          itens.push(numero - 1);
        } else if (diferenca > 2) {
          itens.push(null);
        }
      }

      itens.push(numero);
    });

    return itens;
  }

  irPara(pagina: number): void {
    if (
      pagina < 1 ||
      pagina > this.totalPaginas ||
      pagina === this.paginaAtual
    ) {
      return;
    }

    this.paginaAlterada.emit(pagina);
  }
}
