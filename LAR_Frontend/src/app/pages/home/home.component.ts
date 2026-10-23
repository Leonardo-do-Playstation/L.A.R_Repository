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

  superAdmin = false;

  constructor(private authService: AuthService) {
    const perfil = this.authService.obterPerfil();
    this.tipoUsuario = perfil?.tipo ?? null;
    this.superAdmin = perfil?.superAdmin === true;
  }

  ehSuperAdmin(): boolean {
    return this.ehAdministrador() && this.superAdmin;
  }

  ehVisitante(): boolean {
    return this.tipoUsuario === null;
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
