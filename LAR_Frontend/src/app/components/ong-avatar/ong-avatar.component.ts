import {
  Component,
  HostBinding,
  HostListener,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'app-ong-avatar',
  standalone: true,
  template: `
    @if (foto && !falhou) {
      @if (ampliavel) {
        <button
          type="button"
          class="ong-avatar__abrir"
          aria-label="Ampliar foto"
          (click)="ampliada = true"
        >
          <img class="ong-avatar__img" [src]="foto" alt="" (error)="falhou = true" />
        </button>
      } @else {
        <img class="ong-avatar__img" [src]="foto" alt="" (error)="falhou = true" />
      }
    } @else {
      <span aria-hidden="true">{{ inicial }}</span>
    }

    @if (ampliada && foto) {
      <div class="ong-avatar__overlay" role="dialog" aria-modal="true" aria-label="Foto ampliada" (click)="ampliada = false">
        <img class="ong-avatar__grande" [src]="foto" [alt]="'Foto de ' + nome" (click)="$event.stopPropagation()" />

        <button type="button" class="ong-avatar__fechar" aria-label="Fechar" (click)="ampliada = false">
          ×
        </button>
      </div>
    }
  `,
  styles: `
    :host {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      overflow: hidden;
      border-radius: 50%;
      background: #e8f6e7;
      color: #2b9e25;
      font-weight: 800;
    }

    .ong-avatar__img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .ong-avatar__abrir {
      width: 100%;
      height: 100%;
      padding: 0;
      border: 0;
      background: none;
      cursor: zoom-in;
    }

    .ong-avatar__overlay {
      position: fixed;
      inset: 0;
      z-index: 2000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      background: rgba(0, 0, 0, 0.8);
      font-size: 1rem;
      cursor: zoom-out;
    }

    .ong-avatar__grande {
      max-width: 100%;
      max-height: 100%;
      border-radius: 8px;
      object-fit: contain;
      cursor: default;
    }

    .ong-avatar__fechar {
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
export class OngAvatarComponent implements OnChanges {
  @Input() foto: string | null | undefined = null;
  @Input({ required: true }) nome = '';
  @Input() tamanho = 52;
  @Input() ampliavel = false;

  falhou = false;
  ampliada = false;

  @HostBinding('style.width.px')
  get largura(): number {
    return this.tamanho;
  }

  @HostBinding('style.height.px')
  get altura(): number {
    return this.tamanho;
  }

  @HostBinding('style.font-size.rem')
  get tamanhoFonte(): number {
    return this.tamanho / 40;
  }

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