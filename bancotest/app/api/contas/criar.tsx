import type { NextApiRequest, NextApiResponse } from 'next';
import { connection } from '@/app/database/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end('Método não permitido');

  const { idPessoa, tipoConta, limiteSaqueDiario } = req.body;

  try {
    const [result] = await connection.query(
      `INSERT INTO Contas (idPessoa, saldo, limiteSaqueDiario, flagAtivo, tipoConta)
       VALUES (?, 0, ?, true, ?)`,
      [idPessoa, limiteSaqueDiario ?? 1000.0, tipoConta]
    );

    res.status(201).json({ idConta: (result as any).insertId });
  } catch (error) {
    console.error('Erro ao criar conta:', error);
    res.status(500).json({ erro: 'Erro ao criar conta' });
  }
}