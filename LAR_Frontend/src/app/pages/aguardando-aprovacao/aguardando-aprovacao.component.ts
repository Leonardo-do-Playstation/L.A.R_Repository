import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ContaService, PerfilDetalhe } from '../../services/conta.service';
import { BotaoVoltarComponent } from '../../components/botao-voltar/botao-voltar.component';

interface ItemPerfil {
  rotulo: string;
  preenchido: boolean;
}

@Component({
  selector: 'app-aguardando-aprovacao',
  standalone: true,
  imports: [RouterLink, BotaoVoltarComponent],
  templateUrl: './aguardando-aprovacao.component.html',
  styleUrl: './aguardando-aprovacao.component.css',
})
export class AguardandoAprovacaoComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly contaService = inject(ContaService);

  @ViewChild('dialogo') dialogo?: ElementRef<HTMLElement>;

  nomeOng: string | null = this.authService.obterPerfil()?.nome ?? null;

  mostrarBoasVindas = false;
  itensPerfil: ItemPerfil[] = [];

  private elementoAnterior: HTMLElement | null = null;

  ngOnInit(): void {
    const perfil = this.authService.obterPerfil();

    if (perfil?.tipo !== 'ONG' || perfil.statusOng !== 'PENDENTE') {
      return;
    }

    const chave = `lar.boas-vindas-ong.${perfil.id}`;

    if (this.jaExibido(chave)) {
      return;
    }

    this.contaService.buscarPerfil('ONG').subscribe({
      next: (dados) => {
        const itens = this.montarItens(dados);

        if (itens.every((item) => item.preenchido)) {
          return;
        }

        this.itensPerfil = itens;
        this.marcarComoExibido(chave);
        this.abrirBoasVindas();
      },
      error: () => {},
    });
  }

  fechar(): void {
    this.mostrarBoasVindas = false;

    if (this.elementoAnterior?.isConnected) {
      this.elementoAnterior.focus();
    }

    this.elementoAnterior = null;
  }

  @HostListener('document:keydown', ['$event'])
  aoPressionarTecla(evento: KeyboardEvent): void {
    if (!this.mostrarBoasVindas) {
      return;
    }

    if (evento.key === 'Escape') {
      evento.preventDefault();
      this.fechar();
      return;
    }

    if (evento.key !== 'Tab') {
      return;
    }

    const focaveis = this.elementosFocaveis();

    if (focaveis.length === 0) {
      return;
    }

    const primeiro = focaveis[0];
    const ultimo = focaveis[focaveis.length - 1];
    const ativo = document.activeElement;
    const noInicio =
      ativo === primeiro || ativo === this.dialogo?.nativeElement;

    if (evento.shiftKey && noInicio) {
      evento.preventDefault();
      ultimo.focus();
    } else if (!evento.shiftKey && ativo === ultimo) {
      evento.preventDefault();
      primeiro.focus();
    }
  }

  private abrirBoasVindas(): void {
    this.elementoAnterior = document.activeElement as HTMLElement | null;
    this.mostrarBoasVindas = true;

    setTimeout(() => {
      const focaveis = this.elementosFocaveis();

      if (focaveis.length > 0) {
        focaveis[0].focus();
      } else {
        this.dialogo?.nativeElement.focus();
      }
    });
  }

  private elementosFocaveis(): HTMLElement[] {
    const elementos = this.dialogo?.nativeElement.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled])',
    );

    return elementos ? Array.from(elementos) : [];
  }

  private montarItens(dados: PerfilDetalhe): ItemPerfil[] {
    return [
      { rotulo: 'Foto da ONG', preenchido: !!dados.foto?.trim() },
      { rotulo: 'Telefone', preenchido: !!dados.telefone?.trim() },
      { rotulo: 'Endereço', preenchido: !!dados.endereco?.trim() },
      { rotulo: 'Sobre a ONG', preenchido: !!dados.observacoes?.trim() },
    ];
  }

  private jaExibido(chave: string): boolean {
    try {
      return localStorage.getItem(chave) !== null;
    } catch {
      return false;
    }
  }

  private marcarComoExibido(chave: string): void {
    try {
      localStorage.setItem(chave, 'true');
    } catch {}
  }
}
