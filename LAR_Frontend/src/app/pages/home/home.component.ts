import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService, TipoUsuario } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  tipoUsuario: TipoUsuario | null = null;

  constructor(private authService: AuthService) {
    this.tipoUsuario = this.authService.obterPerfil()?.tipo ?? null;
  }

  ehAdotante(): boolean {
    return this.tipoUsuario === 'ADOTANTE';
  }

  ehOng(): boolean {
    return this.tipoUsuario === 'ONG';
  }

  ehAdministrador(): boolean {
    return this.tipoUsuario === 'ADMINISTRADOR';
  }
}
