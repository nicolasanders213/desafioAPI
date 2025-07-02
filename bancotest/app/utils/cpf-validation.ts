export function validarCPF(cpf: string): boolean {
  const somenteNumeros = cpf.replace(/\D/g, '');
  return somenteNumeros.length === 11;
}