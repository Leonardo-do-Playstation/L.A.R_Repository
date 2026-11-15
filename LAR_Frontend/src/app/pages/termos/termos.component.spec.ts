import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { TermosComponent } from './termos.component';

describe('TermosComponent', () => {
  let fixture: ComponentFixture<TermosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TermosComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(TermosComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should show the page title and the back button', () => {
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('h1')?.textContent).toContain('Termos de Uso');
    expect(element.querySelector('app-botao-voltar')).toBeTruthy();
  });

  it('should link to the privacy page', () => {
    const link = (fixture.nativeElement as HTMLElement).querySelector(
      'a[href="/privacidade"]',
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
    expect(element.querySelector('a[href="/privacidade"]')).toBeNull();

    element.querySelector<HTMLButtonElement>('button.termos__link')?.click();

    expect(emitiu).toBeTrue();
  });
});
