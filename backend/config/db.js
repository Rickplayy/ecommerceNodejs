
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('ecommercee', 'root', 'root', {
  host: 'localhost',
  dialect: 'mysql'
});

module.exports = sequelize;
