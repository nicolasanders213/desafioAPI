import { connection } from "@/app/database/db";

export async function buscarUsuarioCompletoPorCpf(cpf: string) {
  const [rows]: any[] = await connection.query(
    `
    SELECT 
      p.nome, 
      p.cpf, 
      p.dataNascimento, 
      c.saldo, 
      c.limiteSaqueDiario, 
      c.flagAtivo, 
      c.tipoConta, 
      c.dataCriacao
    FROM Pessoas p
    INNER JOIN Contas c ON p.idPessoa = c.idPessoa
    WHERE p.cpf = ?
    `,
    [cpf]
  );

  if (rows.length === 0) return null;

  const usuario = rows[0];

  const tipoContaTextoMap: Record<number, string> = {
  1: 'Corrente',
  2: 'Poupança',
  3: 'Salário'
};

const tipoContaTexto = tipoContaTextoMap[usuario.tipoConta] ?? 'Desconhecido';

  return {
    nome: usuario.nome,
    cpf: usuario.cpf,
    dataNascimento: usuario.dataNascimento,
    saldo: parseFloat(usuario.saldo),
    limiteSaqueDiario: parseFloat(usuario.limiteSaqueDiario),
    flagAtivo: !!usuario.flagAtivo,
    tipoConta: usuario.tipoConta,
    tipoContaDescricao: tipoContaTexto,
    dataCriacao: usuario.dataCriacao,
  };
}