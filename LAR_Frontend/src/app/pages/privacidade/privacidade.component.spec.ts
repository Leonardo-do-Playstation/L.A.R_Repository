import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { PrivacidadeComponent } from './privacidade.component';

describe('PrivacidadeComponent', () => {
  let fixture: ComponentFixture<PrivacidadeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrivacidadeComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(PrivacidadeComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should show the page title and the back button', () => {
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('h1')?.textContent).toContain('Política de Privacidade');
    expect(element.querySelector('app-botao-voltar')).toBeTruthy();
  });

  it('should link to the terms page', () => {
    const link = (fixture.nativeElement as HTMLElement).querySelector(
      'a[href="/termos"]',
    );

    expect(link).toBeTruthy();
  });

  it('should embed without the back button and emit when switching document', () => {
    fixture.componentRef.setInput('embutido', true);
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    let emitiu = false;
    fixture.componentInstance.abrirOutro.subscribe(() => (emitiu = true));

    expect(element.querySelector('app-botao-voltar')).toBeNull();
    expect(element.querySelector('a[href="/termos"]')).toBeNull();

    element.querySelector<HTMLButtonElement>('button.privacidade__link')?.click();

    expect(emitiu).toBeTrue();
  });
});
