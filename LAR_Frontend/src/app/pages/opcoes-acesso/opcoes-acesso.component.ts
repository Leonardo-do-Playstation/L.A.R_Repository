import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Params, RouterLink } from '@angular/router';
import { BotaoVoltarComponent } from '../../components/botao-voltar/botao-voltar.component';

interface OpcaoAcesso {
  rotulo: string;
  rota: string;
  queryParams?: Params;
}

const OPCOES_ADOTANTE: OpcaoAcesso[] = [
  { rotulo: 'Entrar sem login', rota: '/catalogo' },
  { rotulo: 'Fazer login', rota: '/login' },
  { rotulo: 'Criar conta', rota: '/cadastro' },
];

const OPCOES_ONG: OpcaoAcesso[] = [
  { rotulo: 'Fazer login', rota: '/login', queryParams: { tipo: 'ong' } },
  { rotulo: 'Criar conta', rota: '/cadastro-ong' },
];

@Component({
  selector: 'app-opcoes-acesso',
  standalone: true,
  imports: [RouterLink, BotaoVoltarComponent],
  templateUrl: './opcoes-acesso.component.html',
  styleUrl: './opcoes-acesso.component.css',
})
export class OpcoesAcessoComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);

  titulo = '';
  opcoes: OpcaoAcesso[] = [];

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      if (data['tipo'] === 'ong') {
        this.titulo = 'Sou uma ONG';
        this.opcoes = OPCOES_ONG;
      } else {
        this.titulo = 'Quero adotar';
        this.opcoes = OPCOES_ADOTANTE;
      }
    });
  }
}
