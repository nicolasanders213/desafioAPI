import { NextRequest, NextResponse } from 'next/server';
import { transferirEntreContas } from '@/app/services/database/transferenciaService';

export async function POST(req: NextRequest) {
  const { idContaOrigem, idContaDestino, valor } = await req.json();

  if (!idContaOrigem || !idContaDestino || typeof valor !== 'number') {
    return NextResponse.json({ erro: 'Parâmetros inválidos' }, { status: 400 });
  }

  const resultado = await transferirEntreContas(idContaOrigem, idContaDestino, valor);

  if (!resultado.sucesso) {
    return NextResponse.json({ erro: resultado.erro }, { status: 400 });
  }

  return NextResponse.json({ sucesso: true });
}