import { Component, Input } from '@angular/core';

export type VarianteSkeleton = 'animal-card' | 'animal-painel' | 'ong-card';

@Component({
  selector: 'app-skeleton',
  standalone: true,
  imports: [],
  templateUrl: './skeleton.component.html',
  styleUrl: './skeleton.component.css',
})
export class SkeletonComponent {
  @Input() variante: VarianteSkeleton = 'animal-card';
  @Input() quantidade = 4;
  @Input() texto = 'Carregando…';

  get itens(): number[] {
    return Array.from({ length: Math.max(0, this.quantidade) }, (_, indice) => indice);
  }
}
