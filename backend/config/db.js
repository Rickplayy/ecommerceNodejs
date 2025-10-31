
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  database: process.env.RDS_DB_NAME, // ← SIN valor por defecto
  username: process.env.RDS_USERNAME, // ← SIN valor por defecto  
  password: process.env.RDS_PASSWORD, // ← SIN valor por defecto
  host: process.env.RDS_HOSTNAME, // ← SIN 'localhost'
  port: process.env.RDS_PORT || 3306,
  dialect: 'mysql',
  dialectOptions: {
    connectTimeout: 60000,
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});

// Función mejorada para crear base de datos si no existe
const mysql = require('mysql2/promise');

async function createDatabaseIfNotExists() {
  // Solo ejecutar si estamos en RDS (con variables de entorno)
  if (!process.env.RDS_HOSTNAME) {
    console.log('No RDS environment variables found, skipping database creation');
    return;
  }

  try {
    const connection = await mysql.createConnection({
      host: process.env.RDS_HOSTNAME,
      user: process.env.RDS_USERNAME,
      password: process.env.RDS_PASSWORD,
      port: process.env.RDS_PORT || 3306,
      ssl: {
        rejectUnauthorized: false
      }
    });
    
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.RDS_DB_NAME}\``);
    await connection.end();
    console.log('RDS database check completed');
  } catch (error) {
    console.error('Error with RDS database:', error.message);
  }
}

// Función para verificar conexión
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Connection to database has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error.message);
  }
}

// Inicialización
async function initializeDatabase() {
  await createDatabaseIfNotExists();
  await testConnection();
}

initializeDatabase();

module.exports = sequelize;