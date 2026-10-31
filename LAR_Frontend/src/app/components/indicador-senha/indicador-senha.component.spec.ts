import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicadorSenhaComponent } from './indicador-senha.component';

describe('IndicadorSenhaComponent', () => {
  let component: IndicadorSenhaComponent;
  let fixture: ComponentFixture<IndicadorSenhaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IndicadorSenhaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IndicadorSenhaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
