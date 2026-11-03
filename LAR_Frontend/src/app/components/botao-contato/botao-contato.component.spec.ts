import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BotaoContatoComponent } from './botao-contato.component';

describe('BotaoContatoComponent', () => {
  let component: BotaoContatoComponent;
  let fixture: ComponentFixture<BotaoContatoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BotaoContatoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BotaoContatoComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('tipo', 'whatsapp');
    fixture.componentRef.setInput('href', 'https://wa.me/5511999999999');
    fixture.componentRef.setInput('rotulo', 'Falar no WhatsApp');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('exibe o icone correspondente ao tipo', () => {
    const imagem = fixture.nativeElement.querySelector('img') as HTMLImageElement;
    expect(imagem.getAttribute('src')).toBe('/assets/whatsapp.svg');
  });

  it('exibe somente o icone quando nao ha texto', () => {
    const link = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;
    expect(link.classList.contains('botao-contato--icone')).toBeTrue();
  });
});
