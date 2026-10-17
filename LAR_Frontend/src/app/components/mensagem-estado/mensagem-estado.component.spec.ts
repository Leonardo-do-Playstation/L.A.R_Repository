import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MensagemEstadoComponent } from './mensagem-estado.component';

describe('MensagemEstadoComponent', () => {
  let component: MensagemEstadoComponent;
  let fixture: ComponentFixture<MensagemEstadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MensagemEstadoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MensagemEstadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
