import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginacaoComponent } from './paginacao.component';

describe('PaginacaoComponent', () => {
  let component: PaginacaoComponent;
  let fixture: ComponentFixture<PaginacaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginacaoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PaginacaoComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('nao deve renderizar com apenas uma pagina', () => {
    component.paginaAtual = 1;
    component.totalPaginas = 1;
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('nav')).toBeNull();
  });

  it('deve listar todas as paginas quando forem poucas', () => {
    component.paginaAtual = 1;
    component.totalPaginas = 4;

    expect(component.itens).toEqual([1, 2, 3, 4]);
  });

  it('deve usar reticencias quando houver muitas paginas', () => {
    component.paginaAtual = 5;
    component.totalPaginas = 10;

    expect(component.itens).toEqual([1, null, 4, 5, 6, null, 10]);
  });

  it('deve emitir a pagina escolhida', () => {
    component.paginaAtual = 2;
    component.totalPaginas = 5;
    const emitidas: number[] = [];
    component.paginaAlterada.subscribe((pagina) => emitidas.push(pagina));

    component.irPara(3);
    component.irPara(2);
    component.irPara(6);
    component.irPara(0);

    expect(emitidas).toEqual([3]);
  });
});
