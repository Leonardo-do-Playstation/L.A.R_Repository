import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BotaoVoltarComponent } from '../../components/botao-voltar/botao-voltar.component';

@Component({
  selector: 'app-sobre',
  standalone: true,
  imports: [BotaoVoltarComponent, RouterLink],
  templateUrl: './sobre.component.html',
  styleUrl: './sobre.component.css'
})
export class SobreComponent {}
