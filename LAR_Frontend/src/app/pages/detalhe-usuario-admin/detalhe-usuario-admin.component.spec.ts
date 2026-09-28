import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { DetalheUsuarioAdminComponent } from './detalhe-usuario-admin.component';

describe('DetalheUsuarioAdminComponent', () => {
  let component: DetalheUsuarioAdminComponent;
  let fixture: ComponentFixture<DetalheUsuarioAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalheUsuarioAdminComponent],
      providers: [provideHttpClient(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(DetalheUsuarioAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
