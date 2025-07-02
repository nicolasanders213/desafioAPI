import { connection } from '@/app/database/db';

export async function criarConta(idPessoa: number, tipoConta: number, limiteSaqueDiario: number = 1000) {
  const [result] = await connection.query(
    `INSERT INTO Contas (idPessoa, saldo, limiteSaqueDiario, flagAtivo, tipoConta)
     VALUES (?, 0, ?, true, ?)`,
    [idPessoa, limiteSaqueDiario, tipoConta]
  );

  return { idConta: (result as any).insertId };
}

export async function buscarContaPorIdPessoa(idPessoa: number) {
  const [rows]: any = await connection.query(
    `SELECT idConta, saldo, limiteSaqueDiario FROM Contas WHERE idPessoa = ? AND flagAtivo = true`,
    [idPessoa]
  );

  return rows.length > 0 ? rows[0] : null;
}