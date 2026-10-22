import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { OngService } from '../../services/ong.service';
import { OngAvatarComponent } from '../ong-avatar/ong-avatar.component';

@Component({
  selector: 'app-foto-ong',
  standalone: true,
  imports: [OngAvatarComponent],
  template: `
    <div class="foto-ong">
      @if (preview) {
        <img class="foto-ong__preview" [src]="preview" alt="Pré-visualização da nova foto" />
      } @else {
                <app-ong-avatar [foto]="foto" [nome]="nome" [tamanho]="96" [ampliavel]="true" />
      }

      <div class="foto-ong__acoes">
        <input
          #entrada
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          hidden
          (change)="selecionar($event)"
        />

        @if (arquivo) {
          <button type="button" class="foto-ong__botao" (click)="salvar()" [disabled]="enviando">
            {{ enviando ? 'Enviando...' : 'Salvar foto' }}
          </button>

          <button
            type="button"
            class="foto-ong__botao foto-ong__botao--secundario"
            (click)="cancelar()"
            [disabled]="enviando"
          >
            Cancelar
          </button>
        } @else {
          <button
            type="button"
            class="foto-ong__botao foto-ong__botao--secundario"
            (click)="entrada.click()"
            [disabled]="removendo"
          >
            {{ foto ? 'Trocar foto' : 'Adicionar foto' }}
          </button>

          @if (foto) {
            <button
              type="button"
              class="foto-ong__botao foto-ong__botao--perigo"
              (click)="remover()"
              [disabled]="removendo"
            >
              {{ removendo ? 'Removendo...' : 'Remover foto' }}
            </button>
          }
        }
      </div>
    </div>

    <small class="foto-ong__dica">JPG, PNG, WEBP ou GIF, até 5 MB.</small>

    @if (erro) {
      <div class="foto-ong__aviso foto-ong__aviso--erro" role="alert">{{ erro }}</div>
    }

    @if (sucesso) {
      <div class="foto-ong__aviso foto-ong__aviso--sucesso" role="status">{{ sucesso }}</div>
    }
  `,
  styles: `
    :host {
      display: block;
      margin-bottom: 16px;
    }

    .foto-ong {
      display: flex;
      align-items: center;
      gap: 16px;
      flex-wrap: wrap;
    }

    .foto-ong__preview {
      width: 96px;
      height: 96px;
      border-radius: 50%;
      object-fit: cover;
    }

    .foto-ong__acoes {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .foto-ong__botao {
      height: 36px;
      padding: 0 14px;
      border: 2px solid #24851f;
      border-radius: 8px;
      background: #24851f;
      color: #fff;
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
    }

    .foto-ong__botao--secundario {
      background: #fff;
      color: #24851f;
    }

    .foto-ong__botao--perigo {
      border-color: #b42323;
      background: #fff;
      color: #b42323;
    }

    .foto-ong__botao:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .foto-ong__dica {
      display: block;
      margin-top: 8px;
      color: #777;
      font-size: 0.78rem;
    }

    .foto-ong__aviso {
      margin-top: 10px;
      padding: 9px 12px;
      border-radius: 7px;
      font-size: 0.85rem;
    }

    .foto-ong__aviso--erro {
      border: 1px solid #e0a4a4;
      background: #fff1f1;
      color: #9b1c1c;
    }

    .foto-ong__aviso--sucesso {
      border: 1px solid #8bc587;
      background: #edf8ec;
      color: #24631f;
    }
  `,
})
export class FotoOngComponent {
  private readonly ongService = inject(OngService);

  @Input() foto: string | null | undefined = null;
  @Input({ required: true }) nome = '';

  @Output() fotoAlterada = new EventEmitter<string | null>();

  arquivo: File | null = null;
  preview: string | null = null;

  enviando = false;
  removendo = false;
  erro = '';
  sucesso = '';

  private readonly tiposPermitidos = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
  ];
  private readonly tamanhoMaximo = 5 * 1024 * 1024;

  selecionar(event: Event): void {
    const input = event.target as HTMLInputElement;
    const arquivo = input.files?.[0] ?? null;

    this.erro = '';
    this.sucesso = '';

    if (!arquivo) {
      return;
    }

    if (!this.tiposPermitidos.includes(arquivo.type)) {
      this.erro = 'Selecione uma imagem válida (JPG, PNG, WEBP ou GIF).';
      input.value = '';
      return;
    }

    if (arquivo.size > this.tamanhoMaximo) {
      this.erro = 'A foto deve ter no máximo 5 MB.';
      input.value = '';
      return;
    }

    this.arquivo = arquivo;

    const leitor = new FileReader();
    leitor.onload = () => (this.preview = leitor.result as string);
    leitor.readAsDataURL(arquivo);

    input.value = '';
  }

  cancelar(): void {
    this.arquivo = null;
    this.preview = null;
    this.erro = '';
  }

  salvar(): void {
    if (!this.arquivo || this.enviando) {
      return;
    }

    this.enviando = true;
    this.erro = '';
    this.sucesso = '';

    this.ongService.enviarFoto(this.arquivo).subscribe({
      next: (perfil) => {
        this.enviando = false;
        this.cancelar();
        this.sucesso = 'Foto atualizada com sucesso.';
        this.fotoAlterada.emit(perfil.foto ?? null);
      },

      error: (erro: HttpErrorResponse) => {
        this.enviando = false;
        this.erro =
          erro.error?.mensagem ?? 'Não foi possível enviar a foto. Tente novamente.';
      },
    });
  }

  remover(): void {
    if (this.removendo) {
      return;
    }

    this.removendo = true;
    this.erro = '';
    this.sucesso = '';

    this.ongService.removerFoto().subscribe({
      next: () => {
        this.removendo = false;
        this.sucesso = 'Foto removida.';
        this.fotoAlterada.emit(null);
      },

      error: (erro: HttpErrorResponse) => {
        this.removendo = false;
        this.erro =
          erro.error?.mensagem ?? 'Não foi possível remover a foto. Tente novamente.';
      },
    });
  }
}