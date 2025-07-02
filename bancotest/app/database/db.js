import mysql from "mysql2/promise";

const dbName = 'bancoteste2';

export async function createDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      port: 3306,
      password: 'nicoleto'
    });

    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
    console.log(`Banco de dados '${dbName}' criado ou já existente.`);
    await connection.end();
  } catch (err) {
    console.error('Erro ao criar o banco de dados:', err);
  }
}

createDatabase();

export const connection = mysql.createPool({
  host: 'localhost',
  user: 'root',
  port: 3306,
  password: 'nicoleto',
  database: dbName,
  waitForConnections: true,
  connectionLimit: 10,
});