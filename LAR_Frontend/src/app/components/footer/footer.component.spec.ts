import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { FooterComponent } from './footer.component';

describe('FooterComponent', () => {
  let fixture: ComponentFixture<FooterComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(FooterComponent);
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should show links for public navigation pages', () => {
    spyOnProperty(router, 'url', 'get').and.returnValue('/catalogo');

    fixture.componentInstance['atualizarVisibilidade']();
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('footer')).toBeTruthy();
    expect(element.textContent).toContain('Animais para adoção');
    expect(element.textContent).toContain('Termos de Uso');
    expect(element.textContent).toContain('Política de Privacidade');
  });

  it('should hide on the entry page', () => {
    spyOnProperty(router, 'url', 'get').and.returnValue('/');

    fixture.componentInstance['atualizarVisibilidade']();
    fixture.detectChanges();

    expect(
      (fixture.nativeElement as HTMLElement).querySelector('footer'),
    ).toBeNull();
  });

  it('should hide on the login page', () => {
    spyOnProperty(router, 'url', 'get').and.returnValue('/login');

    fixture.componentInstance['atualizarVisibilidade']();
    fixture.detectChanges();

    expect(
      (fixture.nativeElement as HTMLElement).querySelector('footer'),
    ).toBeNull();
  });

  it('should show the footer on the home and profile pages for any profile', () => {
    const url = spyOnProperty(router, 'url', 'get');
    const element = fixture.nativeElement as HTMLElement;

    for (const rota of [
      '/home',
      '/perfil',
      '/painel-animais',
      '/admin/usuarios',
    ]) {
      url.and.returnValue(rota);
      fixture.componentInstance['atualizarVisibilidade']();
      fixture.detectChanges();

      expect(element.querySelector('footer')).withContext(rota).toBeTruthy();
    }
  });
});
