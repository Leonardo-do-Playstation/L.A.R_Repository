import {
  Component,
  HostListener,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'app-ong-banner',
  standalone: true,
  template: `
    @if (foto && !falhou) {
      <button type="button" class="ong-banner__abrir" aria-label="Ampliar foto" (click)="ampliada = true">
        <img class="ong-banner__fundo" [src]="foto" alt="" aria-hidden="true" />
        <img class="ong-banner__img" [src]="foto" alt="" (error)="falhou = true" />
      </button>
    } @else {
      <div class="ong-banner__vazio" aria-hidden="true">{{ inicial }}</div>
    }

    @if (ampliada && foto) {
      <div class="ong-banner__overlay" role="dialog" aria-modal="true" aria-label="Foto ampliada" (click)="ampliada = false">
        <img class="ong-banner__grande" [src]="foto" [alt]="'Foto de ' + nome" (click)="$event.stopPropagation()" />

        <button type="button" class="ong-banner__fechar" aria-label="Fechar" (click)="ampliada = false">
          ×
        </button>
      </div>
    }
  `,
  styles: `
    :host {
      display: block;
      overflow: hidden;
      background: #e8f6e7;
    }

    .ong-banner__abrir {
      position: relative;
      display: flex;
      justify-content: center;
      width: 100%;
      padding: 0;
      border: 0;
      overflow: hidden;
      background: none;
      cursor: zoom-in;
    }

    .ong-banner__fundo {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      filter: blur(18px);
      transform: scale(1.15);
      opacity: 0.6;
    }

    .ong-banner__img {
      position: relative;
      display: block;
      max-width: 100%;
      max-height: 320px;
      object-fit: contain;
    }

    .ong-banner__vazio {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 180px;
      background: linear-gradient(135deg, #e8f6e7, #bfe3bc);
      color: #2b9e25;
      font-size: 4rem;
      font-weight: 800;
    }

    .ong-banner__overlay {
      position: fixed;
      inset: 0;
      z-index: 2000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      background: rgba(0, 0, 0, 0.8);
      cursor: zoom-out;
    }

    .ong-banner__grande {
      max-width: 100%;
      max-height: 100%;
      border-radius: 8px;
      object-fit: contain;
      cursor: default;
    }

    .ong-banner__fechar {
      position: absolute;
      top: 14px;
      right: 18px;
      border: 0;
      background: none;
      color: #fff;
      font-size: 2.2rem;
      line-height: 1;
      cursor: pointer;
    }
  `,
})
export class OngBannerComponent implements OnChanges {
  @Input() foto: string | null | undefined = null;
  @Input({ required: true }) nome = '';

  falhou = false;
  ampliada = false;

  get inicial(): string {
    return this.nome.trim().charAt(0).toUpperCase();
  }

  @HostListener('document:keydown.escape')
  fecharComEsc(): void {
    this.ampliada = false;
  }

  ngOnChanges(mudancas: SimpleChanges): void {
    if (mudancas['foto']) {
      this.falhou = false;
      this.ampliada = false;
    }
  }
}