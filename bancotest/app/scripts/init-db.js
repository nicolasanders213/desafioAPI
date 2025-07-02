import { connection, createDatabase } from '../database/db.js';

async function initDB() {
  try {
    await createDatabase();

    await connection.query(`
      CREATE TABLE IF NOT EXISTS Pessoas (
      idPessoa INT AUTO_INCREMENT PRIMARY KEY,
      nome VARCHAR(100) NOT NULL,
      cpf VARCHAR(14) UNIQUE NOT NULL,
      dataNascimento DATE NOT NULL,
      senha VARCHAR(255) NOT NULL
      );
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS Contas (
        idConta INT AUTO_INCREMENT PRIMARY KEY,
        idPessoa INT NOT NULL,
        saldo DECIMAL(15,2) NOT NULL DEFAULT 0.00,
        limiteSaqueDiario DECIMAL(15,2) NOT NULL DEFAULT 1000.00,
        flagAtivo BOOLEAN NOT NULL DEFAULT TRUE,
        tipoConta INT NOT NULL,
        dataCriacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (idPessoa) REFERENCES Pessoas(idPessoa)
      );
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS Transacoes (
        idTransacao INT AUTO_INCREMENT PRIMARY KEY,
        idConta INT NOT NULL,
        valor DECIMAL(15,2) NOT NULL,
        dataTransacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (idConta) REFERENCES Contas(idConta)
      );
    `);

    console.log('Banco inicializado com sucesso!');
    process.exit(0);
  } catch (err) {
    console.error('Erro ao inicializar o banco:', err);
    process.exit(1);
  }
}

initDB();