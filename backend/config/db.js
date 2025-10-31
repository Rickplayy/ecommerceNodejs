
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  database: process.env.RDS_DB_NAME || 'ecommercee',
  username: process.env.RDS_USERNAME || 'root',
  password: process.env.RDS_PASSWORD || 'root',
  host: process.env.RDS_HOSTNAME || 'localhost',
  port: process.env.RDS_PORT || 3306,
  dialect: 'mysql',
  dialectOptions: {
    connectTimeout: 60000,
    ssl: process.env.NODE_ENV === 'production' ? {
      require: true,
      rejectUnauthorized: false
    } : null
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 60000,
    idle: 10000
  },
  logging: process.env.NODE_ENV !== 'production' ? console.log : false
});

// Intentar crear la base de datos si no existe
const mysql = require('mysql2/promise');
async function createDatabaseIfNotExists() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.RDS_HOSTNAME,
      user: process.env.RDS_USERNAME,
      password: process.env.RDS_PASSWORD
    });
    
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.RDS_DB_NAME}`);
    await connection.end();
    console.log('Database check/creation completed');
  } catch (error) {
    console.error('Error creating database:', error);
  }
}

createDatabaseIfNotExists();

module.exports = sequelize;
