import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogoAnimaisComponent } from './catalogo-animais.component';

describe('CatalogoAnimaisComponent', () => {
  let component: CatalogoAnimaisComponent;
  let fixture: ComponentFixture<CatalogoAnimaisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CatalogoAnimaisComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CatalogoAnimaisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
