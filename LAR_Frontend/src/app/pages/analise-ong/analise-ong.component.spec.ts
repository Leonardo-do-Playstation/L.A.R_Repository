import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnaliseOngComponent } from './analise-ong.component';

describe('AnaliseOngComponent', () => {
  let component: AnaliseOngComponent;
  let fixture: ComponentFixture<AnaliseOngComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnaliseOngComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AnaliseOngComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
