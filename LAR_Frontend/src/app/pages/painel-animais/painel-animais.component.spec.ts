import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PainelAnimaisComponent } from './painel-animais.component';

describe('PainelAnimaisComponent', () => {
  let component: PainelAnimaisComponent;
  let fixture: ComponentFixture<PainelAnimaisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PainelAnimaisComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PainelAnimaisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
