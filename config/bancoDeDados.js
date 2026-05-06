const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('projeto_receitas', 'postgres', 'postgres', {
	host: 'localhost',
	dialect: 'postgres',
	logging: false,
});

module.exports = sequelize;
