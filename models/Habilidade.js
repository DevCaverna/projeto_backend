const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/bancoDeDados');

const Habilidade = sequelize.define(
	'Habilidade',
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
	},
	{
		tableName: 'habilidades',
		timestamps: false,
	},
);

module.exports = Habilidade;
