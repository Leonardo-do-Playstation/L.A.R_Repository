import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AtivarAdministradorComponent } from './ativar-administrador.component';

describe('AtivarAdministradorComponent', () => {
  let component: AtivarAdministradorComponent;
  let fixture: ComponentFixture<AtivarAdministradorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AtivarAdministradorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AtivarAdministradorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
