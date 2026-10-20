import { Component, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { RouterOutlet } from '@angular/router';

import { FooterComponent } from './components/footer/footer.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HistoricoNavegacaoService } from './services/historico-navegacao.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  private readonly documento = inject(DOCUMENT);

  constructor() {
    inject(HistoricoNavegacaoService);
  }

  irParaConteudo(evento: Event): void {
    evento.preventDefault();
    this.documento.getElementById('conteudo-principal')?.focus();
  }
}
