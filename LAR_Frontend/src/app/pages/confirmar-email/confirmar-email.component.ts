import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { AuthService } from '../../services/auth.service';
import { ContaService } from '../../services/conta.service';

@Component({
  selector: 'app-confirmar-email',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './confirmar-email.component.html',
  styleUrl: './confirmar-email.component.css',
})
export class ConfirmarEmailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly contaService = inject(ContaService);
  private readonly authService = inject(AuthService);

  token = '';

  processando = false;
  concluido = false;
  erro = '';

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      this.token = params.get('token') ?? '';
    });
  }

  confirmar(): void {
    if (!this.token || this.processando) {
      return;
    }

    this.processando = true;
    this.erro = '';

    this.contaService.confirmarTrocaEmail(this.token).subscribe({
      next: () => {
        this.processando = false;
        this.concluido = true;

        this.authService.limparToken();
      },

      error: (erro: HttpErrorResponse) => {
        this.processando = false;
        this.erro =
          erro.error?.mensagem ??
          'Não foi possível confirmar a troca de e-mail.';
      },
    });
  }
}
