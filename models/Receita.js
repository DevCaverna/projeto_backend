const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/bancoDeDados');

const Receita = sequelize.define(
	'Receita',
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		nome: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		descricao: {
			type: DataTypes.TEXT,
		},
		link_externo: {
			type: DataTypes.STRING,
		},
	},
	{
		tableName: 'receitas',
		timestamps: false,
	},
);

module.exports = Receita;
