
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  database: process.env.RDS_DB_NAME || 'ecommercee',
  username: process.env.RDS_USERNAME || 'root',
  password: process.env.RDS_PASSWORD || 'root',
  host: process.env.RDS_HOSTNAME || 'localhost',
  port: process.env.RDS_PORT || 3306,
  dialect: 'mysql',
  dialectOptions: {
    ssl: process.env.NODE_ENV === 'production' ? {
      require: true,
      rejectUnauthorized: false
    } : null
  },
  logging: process.env.NODE_ENV !== 'production' ? console.log : false
});

module.exports = sequelize;
