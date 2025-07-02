import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { connection } from '@/app/database/db';
import { buscarContaPorCpf } from '@/app/services/database/pessoaService';

export async function GET() {
  const cookieStore = await cookies();
  const cpf = cookieStore.get('usernameCpf')?.value;

  if (!cpf) {
    return NextResponse.json({ erro: 'Usuário não autenticado.' }, { status: 401 });
  }

  try {
    const dados = await buscarContaPorCpf(cpf);
    const idConta = dados?.conta?.idConta;

    if (!idConta) {
      return NextResponse.json({ erro: 'Conta não encontrada.' }, { status: 404 });
    }

    const [rows] = await connection.query(
      `SELECT idTransacao, valor, dataTransacao
       FROM Transacoes
       WHERE idConta = ? AND valor > 0
       ORDER BY dataTransacao DESC`,
      [idConta]
    );

    return NextResponse.json(rows);
  } catch (error) {
    console.error('Erro ao buscar depósitos:', error);
    return NextResponse.json({ erro: 'Erro ao buscar extrato' }, { status: 500 });
  }
}