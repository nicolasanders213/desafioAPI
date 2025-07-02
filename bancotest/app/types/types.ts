export interface Contato {
  idPessoa: number;
  nome: string;
}

export interface Conta {
  idConta: number;
  idPessoa: number;
  saldo: number;
  limiteSaqueDiario: number;
  flagAtivo: boolean;
  tipoConta: number;
  dataCriacao: string;
}

export interface Usuario {
  nome: string;
  cpf: string;
  dataNascimento: string;
  saldo: number;
  limiteSaqueDiario: number;
  flagAtivo: boolean;
  tipoConta: number;
  tipoContaDescricao: string;
  dataCriacao: string;
}

export interface Transacao {
  idTransacao: number;
  idConta: number;
  valor: number;
  dataTransacao: string;
}

export interface Pessoa {
  idPessoa: number;
  nome: string;
  cpf: string;
  dataNascimento: string;
}