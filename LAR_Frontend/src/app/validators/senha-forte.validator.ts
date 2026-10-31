import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const SENHA_TAMANHO_MINIMO = 8;
export const SENHA_TAMANHO_MAXIMO = 72;

export const MENSAGEM_SENHA_FORTE =
  'A senha deve ter de 8 a 72 caracteres, com letra maiúscula, minúscula, número e caractere especial.';

export interface RegraSenha {
  id: 'tamanho' | 'maiuscula' | 'minuscula' | 'numero' | 'especial';
  rotulo: string;
  atende: (senha: string) => boolean;
}

export const REGRAS_SENHA: RegraSenha[] = [
  {
    id: 'tamanho',
    rotulo: 'Mínimo de 8 caracteres',
    atende: (s) => s.length >= SENHA_TAMANHO_MINIMO && s.length <= SENHA_TAMANHO_MAXIMO,
  },
  { id: 'maiuscula', rotulo: 'Uma letra maiúscula', atende: (s) => /\p{Lu}/u.test(s) },
  { id: 'minuscula', rotulo: 'Uma letra minúscula', atende: (s) => /\p{Ll}/u.test(s) },
  { id: 'numero', rotulo: 'Um número', atende: (s) => /\p{Nd}/u.test(s) },
  {
    id: 'especial',
    rotulo: 'Um caractere especial (ex.: ! @ # $ %)',
    atende: (s) => /[^\p{L}\p{N}\s]/u.test(s),
  },
];

export function senhaEhForte(senha: string): boolean {
  return REGRAS_SENHA.every((regra) => regra.atende(senha));
}

export const senhaForte: ValidatorFn = (
  controle: AbstractControl,
): ValidationErrors | null => {
  const valor = controle.value;

  if (typeof valor !== 'string' || valor.trim() === '') {
    return null;
  }

  return senhaEhForte(valor) ? null : { senhaForte: true };
};