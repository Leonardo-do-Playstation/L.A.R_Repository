import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { ListaOngsComponent } from './lista-ongs.component';

describe('ListaOngsComponent', () => {
  let component: ListaOngsComponent;
  let fixture: ComponentFixture<ListaOngsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaOngsComponent],
      providers: [provideHttpClient(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ListaOngsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
