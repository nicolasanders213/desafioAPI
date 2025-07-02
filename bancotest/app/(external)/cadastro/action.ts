export interface UsuarioNovo {
  nome: string;
  cpf: string;
  dataNascimento: string;
  senha: string;
}

export async function cadastrarUsuario(payload: UsuarioNovo): Promise<{ sucesso: boolean; mensagem: string }> {
  try {
    const res = await fetch('/api/pessoas/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      return { sucesso: true, mensagem: 'Usuário cadastrado com sucesso!' };
    } else {
      const erro = await res.json();
      return { sucesso: false, mensagem: erro?.erro || 'Erro desconhecido' };
    }
  } catch (error: any) {
    console.error('Erro ao cadastrar usuário:', error);
    return { sucesso: false, mensagem: 'Erro na requisição' };
  }
}