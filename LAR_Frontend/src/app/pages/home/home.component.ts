import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService, TipoUsuario } from '../../services/auth.service';
import { Animal, AnimalService } from '../../services/animal.service';
import { MensagemEstadoComponent } from '../../components/mensagem-estado/mensagem-estado.component';
import { AnimalCardComponent } from '../../components/animal-card/animal-card.component';
import {
  AnimalCatalogo,
  CatalogoAnimaisService,
} from '../../services/catalogo-animais.service';
import { FavoritoService } from '../../services/favorito.service';

const QUANTIDADE_DESTAQUES = 4;

interface ResumoAnimais {
  total: number;
  disponiveis: number;
  emTratamento: number;
  adotados: number;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, MensagemEstadoComponent, AnimalCardComponent],
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

  private readonly catalogoService = inject(CatalogoAnimaisService);
  private readonly favoritoService = inject(FavoritoService);

  recentesCarregando = false;
  recentesErro = false;
  recentes: AnimalCatalogo[] = [];

  favoritosCarregando = false;
  favoritosErro = false;
  favoritosDestaque: AnimalCatalogo[] = [];
  private idsFavoritos = new Set<number>();

  nomeUsuario = '';

  constructor(
    private authService: AuthService,
    private animalService: AnimalService,
  ) {
    const perfil = this.authService.obterPerfil();
    this.tipoUsuario = perfil?.tipo ?? null;
    this.nomeUsuario = (perfil?.nome ?? '').trim();
    this.superAdmin = perfil?.superAdmin === true;
    this.ongAprovada =
      perfil?.tipo === 'ONG' && perfil.statusOng === 'APROVADA';
  }

  get saudacao(): string {
    if (!this.nomeUsuario) {
      return 'Bem-vindo(a) ao L.A.R.';
    }

    if (this.ehAdotante()) {
      return `Olá, ${this.nomeUsuario.split(/\s+/)[0]}!`;
    }

    return `Olá, ${this.nomeUsuario}!`;
  }

  ngOnInit(): void {
    if (this.exibirResumo()) {
      this.carregarResumo();
    }

    if (this.ehAdotante()) {
      this.carregarRecentes();
      this.carregarFavoritos(false);
    }
  }

  estaFavoritado(animalId: number): boolean {
    return this.idsFavoritos.has(animalId);
  }

  aoAlterarFavorito(animalId: number, favoritado: boolean): void {
    if (favoritado) {
      this.idsFavoritos.add(animalId);
    } else {
      this.idsFavoritos.delete(animalId);
    }

    this.carregarFavoritos(true);
  }

  private carregarRecentes(): void {
    this.recentesCarregando = true;
    this.recentesErro = false;

    this.catalogoService.listarRecentes(QUANTIDADE_DESTAQUES).subscribe({
      next: (animais) => {
        this.recentes = animais;
        this.recentesCarregando = false;
      },
      error: () => {
        this.recentesErro = true;
        this.recentesCarregando = false;
      },
    });
  }

  private carregarFavoritos(silencioso: boolean): void {
    if (!silencioso) {
      this.favoritosCarregando = true;
    }

    this.favoritosErro = false;

    this.favoritoService.listar().subscribe({
      next: (favoritos) => {
        const animais = favoritos.map((favorito) => favorito.animal);

        this.idsFavoritos = new Set(animais.map((animal) => animal.id));
        this.favoritosDestaque = animais.slice(0, QUANTIDADE_DESTAQUES);
        this.favoritosCarregando = false;
      },
      error: () => {
        this.favoritosErro = true;
        this.favoritosCarregando = false;
      },
    });
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
