import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  carregandoLogout = false;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  sair(): void {
    if (this.carregandoLogout) {
      return;
    }

    this.carregandoLogout = true;

    this.authService.logout().subscribe({
      next: () => {
        this.authService.limparToken();
        this.router.navigate(['/login']);
      },

      error: (erro) => {
        console.error('Erro ao realizar logout:', erro);

        this.authService.limparToken();
        this.router.navigate(['/login']);
      },
    });
  }
}
