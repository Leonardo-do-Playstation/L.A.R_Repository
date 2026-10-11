import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpcoesAcessoComponent } from './opcoes-acesso.component';

describe('OpcoesAcessoComponent', () => {
  let component: OpcoesAcessoComponent;
  let fixture: ComponentFixture<OpcoesAcessoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OpcoesAcessoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OpcoesAcessoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
