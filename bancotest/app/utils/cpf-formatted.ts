export function cpfFormatted(cpf: string): string {
  const numeros = cpf?.replace(/\D/g, '').slice(0, 11); // garante até 11 dígitos

  if (numeros?.length !== 11) return cpf; // retorna original se incompleto

  return `${numeros.slice(0, 3)}.${numeros.slice(3, 6)}.${numeros.slice(6, 9)}-${numeros.slice(9, 11)}`;
}