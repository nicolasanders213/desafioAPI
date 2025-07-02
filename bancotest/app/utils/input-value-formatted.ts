export function formatarValorInput(input: string): string {

   const somenteNumeros = input.replace(/\D/g, '');
  const numeroCentavos = parseInt(somenteNumeros || '0', 10);
  const valorReais = numeroCentavos / 100;

  return valorReais.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}