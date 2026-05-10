require('dotenv').config();

const { Sequelize } = require('sequelize');
const mongoose = require('mongoose');

// Mongoose connection
mongoose
	.connect(process.env.MONGO_URI, {})
	.then(() => console.log('Conectado ao MongoDB'))
	.catch((err) => console.error('Erro ao conectar ao MongoDB:', err));

const sequelize = new Sequelize(
	process.env.DB_NAME,
	process.env.DB_USER,
	process.env.DB_PASS,
	{
		host: process.env.DB_HOST,
		dialect: 'postgres',
		logging: false,
	},
);

module.exports = { sequelize, mongoose };
