import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { FooterComponent } from './footer.component';
import { AuthService } from '../../services/auth.service';

describe('FooterComponent', () => {
  let fixture: ComponentFixture<FooterComponent>;
  let router: Router;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    authService = jasmine.createSpyObj<AuthService>('AuthService', [
      'obterPerfil',
    ]);
    authService.obterPerfil.and.returnValue(null);

    await TestBed.configureTestingModule({
      imports: [FooterComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authService },
      ],
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

  it('should hide the footer on the NGO home', () => {
    spyOnProperty(router, 'url', 'get').and.returnValue('/home');
    authService.obterPerfil.and.returnValue({ tipo: 'ONG' } as ReturnType<
      AuthService['obterPerfil']
    >);

    fixture.componentInstance['atualizarVisibilidade']();
    fixture.detectChanges();

    expect(
      (fixture.nativeElement as HTMLElement).querySelector('footer'),
    ).toBeNull();
  });
});
