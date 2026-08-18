const sequelize = require('./backend/config/db'); // Ajusta la ruta

async function testConnection() {
  try {
    console.log('Testing database connection...');

    // 1. Verificar autenticación
    await sequelize.authenticate();
    console.log('Database authentication successful');

    // 2. Ejecutar query simple
    const [result] = await sequelize.query('SELECT 1 + 1 AS result, NOW() AS time, VERSION() AS version');
    console.log('Query test successful:', result);

    // 3. Verificar base de datos actual
    const [dbInfo] = await sequelize.query('SELECT DATABASE() as current_database, USER() as current_user');
    console.log('Database info:', dbInfo);

    console.log('All connection tests passed!');

  } catch (error) {
    console.error('Connection test failed:', error.message);
  } finally {
    await sequelize.close();
  }
}

testConnection();