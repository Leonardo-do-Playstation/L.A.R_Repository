import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';

import { CadastroComponent } from './cadastro.component';

describe('CadastroComponent', () => {
  let component: CadastroComponent;
  let fixture: ComponentFixture<CadastroComponent>;
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastroComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                tipo: 'adotante',
              },
            },
          },
        },
      ],
    }).compileComponents();

    http = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(CadastroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  function preencherFormularioValido(): void {
    component.cadastroForm.patchValue({
      nome: 'Maria Silva',
      cpf: '12345678909',
      email: 'maria@exemplo.com',
      senha: 'Senha@123',
      confirmarSenha: 'Senha@123',
    });
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the consent checkbox with buttons to read the documents', () => {
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('#aceiteTermos')).toBeTruthy();
    expect(
      element.querySelectorAll('.cadastro__aceite .cadastro__link-documento')
        .length,
    ).toBe(2);
    expect(element.querySelector('[role="dialog"]')).toBeNull();
  });

  it('should open the terms in a dialog and close it with Escape', () => {
    const element = fixture.nativeElement as HTMLElement;

    element
      .querySelector<HTMLButtonElement>('.cadastro__link-documento')
      ?.click();
    fixture.detectChanges();

    expect(component.documentoAberto).toBe('termos');
    expect(element.querySelector('[role="dialog"]')).toBeTruthy();

    component.aoPressionarEscape();
    fixture.detectChanges();

    expect(component.documentoAberto).toBeNull();
    expect(element.querySelector('[role="dialog"]')).toBeNull();
  });

  it('should keep the form data while reading the documents', () => {
    preencherFormularioValido();

    component.abrirDocumento('privacidade');
    fixture.detectChanges();
    component.fecharDocumento();
    fixture.detectChanges();

    expect(component.cadastroForm.value.email).toBe('maria@exemplo.com');
  });

  it('should not register without accepting the terms', () => {
    preencherFormularioValido();

    component.cadastrar();
    fixture.detectChanges();

    http.expectNone('http://localhost:8080/adotantes/cadastro');
    expect(component.carregando).toBeFalse();
    expect(component.aceiteTermosInvalido).toBeTrue();
    expect(
      (fixture.nativeElement as HTMLElement).querySelector('#aceiteTermosErro'),
    ).toBeTruthy();
  });

  it('should register after accepting the terms', () => {
    preencherFormularioValido();
    component.cadastroForm.controls.aceiteTermos.setValue(true);

    component.cadastrar();

    const requisicao = http.expectOne('http://localhost:8080/adotantes/cadastro');
    expect(requisicao.request.method).toBe('POST');
    expect(component.aceiteTermosInvalido).toBeFalse();
  });
});
