import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { TipoUsuario } from '../../services/auth.service';
import {
  UsuarioAdmin,
  UsuarioAdminService,
} from '../../services/usuario-admin.service';

@Component({
  selector: 'app-detalhe-usuario-admin',
  standalone: true,
  imports: [],
  templateUrl: './detalhe-usuario-admin.component.html',
  styleUrl: './detalhe-usuario-admin.component.css',
})
export class DetalheUsuarioAdminComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly usuarioAdminService = inject(UsuarioAdminService);

  usuario: UsuarioAdmin | null = null;

  carregando = true;
  naoEncontrado = false;
  erro = '';

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = Number(params.get('id'));
      this.carregarUsuario(id);
    });
  }

  carregarUsuario(id: number): void {
    this.carregando = true;
    this.naoEncontrado = false;
    this.erro = '';

    this.usuarioAdminService.buscarPorId(id).subscribe({
      next: (usuario) => {
        this.usuario = usuario;
        this.carregando = false;
      },

      error: (erro: HttpErrorResponse) => {
        this.carregando = false;

        if (erro.status === 404) {
          this.naoEncontrado = true;
        } else {
          this.erro = 'Não foi possível carregar os dados deste usuário.';
        }
      },
    });
  }

  rotuloTipo(tipo: TipoUsuario): string {
    switch (tipo) {
      case 'ADOTANTE':
        return 'Adotante';
      case 'ONG':
        return 'ONG';
      case 'ADMINISTRADOR':
        return 'Administrador';
    }
  }

  rotuloStatusOng(status: UsuarioAdmin['statusOng']): string {
    switch (status) {
      case 'APROVADA':
        return 'Aprovada';
      case 'RECUSADA':
        return 'Recusada';
      case 'PENDENTE':
        return 'Pendente';
      default:
        return 'Não informado';
    }
  }

  voltar(): void {
    this.router.navigate(['/admin/usuarios']);
  }
}
