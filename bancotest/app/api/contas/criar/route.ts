import { NextRequest, NextResponse } from 'next/server';
import { criarConta } from '@/app/services/database/contaService';

export async function POST(req: NextRequest) {
  const { idPessoa, tipoConta, limiteSaqueDiario } = await req.json();

  if (!idPessoa || !tipoConta) {
    return NextResponse.json({ erro: 'idPessoa e tipoConta são obrigatórios' }, { status: 400 });
  }

  try {
    const { idConta } = await criarConta(idPessoa, tipoConta, limiteSaqueDiario);
    return NextResponse.json({ sucesso: true, idConta });
  } catch (error) {
    console.error('Erro ao criar conta:', error);
    return NextResponse.json({ erro: 'Erro ao criar conta' }, { status: 500 });
  }
}