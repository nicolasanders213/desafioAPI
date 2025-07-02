import { connection } from '@/app/database/db';

interface NovaPessoa {
  nome: string;
  cpf: string;
  dataNascimento: string;
  senha: string;
}

export async function criarPessoaComConta({
  nome,
  cpf,
  dataNascimento,
  senha,
}: NovaPessoa) {
  const conn = await connection.getConnection();

  try {
    await conn.beginTransaction();

    const [pessoaResult] = await conn.query(
      `INSERT INTO Pessoas (nome, cpf, dataNascimento, senha) VALUES (?, ?, ?, ?)`,
      [nome, cpf, dataNascimento, senha]
    );

    const idPessoa = (pessoaResult as any).insertId;

    await conn.query(
      `INSERT INTO Contas (idPessoa, saldo, limiteSaqueDiario, flagAtivo, tipoConta)
       VALUES (?, 0, 1000.00, true, 1)`,
      [idPessoa]
    );

    await conn.commit();
    return idPessoa;
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
}

export async function buscarContaPorCpf(cpf: string) {
  try {
    const [rows]: any = await connection.query(
      `SELECT 
         p.idPessoa, 
         p.nome,
         c.idConta,
         c.saldo,
         c.limiteSaqueDiario,
         c.flagAtivo,
         c.tipoConta
       FROM Pessoas p
       JOIN Contas c ON p.idPessoa = c.idPessoa
       WHERE p.cpf = ?`,
      [cpf]
    );

    if (!Array.isArray(rows) || rows.length === 0) {
      return null;
    }

    const row = rows[0];

    return {
      idPessoa: row.idPessoa,
      nome: row.nome,
      conta: {
        idConta: row.idConta,
        saldo: row.saldo,
        limiteSaqueDiario: row.limiteSaqueDiario,
        flagAtivo: row.flagAtivo,
        tipoConta: row.tipoConta,
      },
    };
  } catch (error) {
    console.error('Erro ao buscar pessoa com conta:', error);
    return null;
  }
}

export async function buscarTodasPessoas() {
  const [rows]: any = await connection.query(
    'SELECT idPessoa, nome FROM Pessoas'
  );
  return rows;
}