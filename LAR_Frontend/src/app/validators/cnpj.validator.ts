import { AbstractControl, ValidationErrors } from '@angular/forms';

export function cnpjValido(valor: string): boolean {
  const cnpj = (valor ?? '').replace(/\D/g, '');

  if (cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) {
    return false;
  }

  const calcular = (base: string, pesos: number[]): number => {
    const soma = pesos.reduce((acc, peso, i) => acc + Number(base[i]) * peso, 0);
    const resto = soma % 11;
    return resto < 2 ? 0 : 11 - resto;
  };

  const digito1 = calcular(cnpj, [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  const digito2 = calcular(cnpj, [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);

  return digito1 === Number(cnpj[12]) && digito2 === Number(cnpj[13]);
}


export function cnpjOpcional(control: AbstractControl): ValidationErrors | null {
  const valor = String(control.value ?? '').trim();

  if (!valor) {
    return null;
  }

  return cnpjValido(valor) ? null : { cnpjInvalido: true };
}