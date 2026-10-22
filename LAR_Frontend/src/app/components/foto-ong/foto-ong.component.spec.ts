import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FotoOngComponent } from './foto-ong.component';

describe('FotoOngComponent', () => {
  let component: FotoOngComponent;
  let fixture: ComponentFixture<FotoOngComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FotoOngComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FotoOngComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
