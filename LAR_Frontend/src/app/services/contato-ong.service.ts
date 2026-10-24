function apenasDigitos(valor: string | null | undefined): string {
  return (valor ?? '').replace(/\D/g, '');
}

function numeroNacional(telefone: string | null | undefined): string | null {
  let digitos = apenasDigitos(telefone).replace(/^0+/, '');

  if (
    (digitos.length === 12 || digitos.length === 13) &&
    digitos.startsWith('55')
  ) {
    digitos = digitos.slice(2);
  }

  if (digitos.length !== 10 && digitos.length !== 11) {
    return null;
  }

  if (Number(digitos.slice(0, 2)) < 11) {
    return null;
  }

  return digitos;
}

function ehCelular(nacional: string): boolean {
  return nacional.length === 11 && nacional.charAt(2) === '9';
}

export function linkWhatsapp(
  telefone: string | null | undefined,
  mensagem?: string,
): string | null {
  const nacional = numeroNacional(telefone);

  if (!nacional || !ehCelular(nacional)) {
    return null;
  }

  const base = `https://wa.me/55${nacional}`;

  return mensagem ? `${base}?text=${encodeURIComponent(mensagem)}` : base;
}

export function linkMaps(endereco: string | null | undefined): string | null {
  const texto = (endereco ?? '').trim();

  if (!texto) {
    return null;
  }

  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(texto)}`;
}
