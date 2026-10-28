import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService, TipoUsuario } from '../../services/auth.service';
import { Animal, AnimalService } from '../../services/animal.service';
import { MensagemEstadoComponent } from '../../components/mensagem-estado/mensagem-estado.component';

interface ResumoAnimais {
  total: number;
  disponiveis: number;
  emTratamento: number;
  adotados: number;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, MensagemEstadoComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  tipoUsuario: TipoUsuario | null = null;

  superAdmin = false;

  ongAprovada = false;

  resumoCarregando = false;
  resumoErro = false;
  resumo: ResumoAnimais = {
    total: 0,
    disponiveis: 0,
    emTratamento: 0,
    adotados: 0,
  };

  constructor(
    private authService: AuthService,
    private animalService: AnimalService,
  ) {
    const perfil = this.authService.obterPerfil();
    this.tipoUsuario = perfil?.tipo ?? null;
    this.superAdmin = perfil?.superAdmin === true;
    this.ongAprovada =
      perfil?.tipo === 'ONG' && perfil.statusOng === 'APROVADA';
  }

  ngOnInit(): void {
    if (this.exibirResumo()) {
      this.carregarResumo();
    }
  }

  exibirResumo(): boolean {
    return this.ehOng() && this.ongAprovada;
  }

  private carregarResumo(): void {
    this.resumoCarregando = true;
    this.resumoErro = false;

    this.animalService.listarMeusAnimais().subscribe({
      next: (animais) => {
        this.resumo = this.calcularResumo(animais);
        this.resumoCarregando = false;
      },
      error: () => {
        this.resumoErro = true;
        this.resumoCarregando = false;
      },
    });
  }

  private calcularResumo(animais: Animal[]): ResumoAnimais {
    return {
      total: animais.length,
      disponiveis: animais.filter((animal) => animal.status === 'DISPONIVEL')
        .length,
      emTratamento: animais.filter(
        (animal) => animal.status === 'EM_TRATAMENTO',
      ).length,
      adotados: animais.filter((animal) => animal.status === 'ADOTADO').length,
    };
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
