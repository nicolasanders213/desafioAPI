import { connection } from '@/app/database/db';

export async function transferirEntreContas(idOrigem: number, idDestino: number, valor: number) {
  const conn = await connection.getConnection();

  try {
    await conn.beginTransaction();

    await conn.query(`UPDATE Contas SET saldo = saldo - ? WHERE idConta = ?`, [valor, idOrigem]);
    await conn.query(`UPDATE Contas SET saldo = saldo + ? WHERE idConta = ?`, [valor, idDestino]);

    await conn.query(`INSERT INTO Transacoes (idConta, valor, dataTransacao) VALUES (?, ?, NOW())`, [idOrigem, -valor]);
    await conn.query(`INSERT INTO Transacoes (idConta, valor, dataTransacao) VALUES (?, ?, NOW())`, [idDestino, valor]);

    await conn.commit();
    return { sucesso: true };
  } catch (error) {
    await conn.rollback();
    console.error('Erro na transferência:', error);
    return { sucesso: false, erro: 'Erro ao realizar transferência' };
  } finally {
    conn.release();
  }
}