import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { BotaoVoltarComponent } from '../../components/botao-voltar/botao-voltar.component';

@Component({
  selector: 'app-aguardando-aprovacao',
  standalone: true,
  imports: [RouterLink, BotaoVoltarComponent],
  templateUrl: './aguardando-aprovacao.component.html',
  styleUrl: './aguardando-aprovacao.component.css',
})
export class AguardandoAprovacaoComponent {
  nomeOng: string | null = null;

  constructor(private authService: AuthService) {
    this.nomeOng = this.authService.obterPerfil()?.nome ?? null;
  }
}
