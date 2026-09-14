import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitacoesCadastroComponent } from './solicitacoes-cadastro.component';

describe('SolicitacoesCadastroComponent', () => {
  let component: SolicitacoesCadastroComponent;
  let fixture: ComponentFixture<SolicitacoesCadastroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolicitacoesCadastroComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SolicitacoesCadastroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
