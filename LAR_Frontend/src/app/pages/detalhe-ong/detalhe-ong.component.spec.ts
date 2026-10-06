import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { DetalheOngComponent } from './detalhe-ong.component';

describe('DetalheOngComponent', () => {
  let component: DetalheOngComponent;
  let fixture: ComponentFixture<DetalheOngComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalheOngComponent],
      providers: [provideHttpClient(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(DetalheOngComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
