const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/bancoDeDados');

const Usuario = sequelize.define(
	'Usuario',
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
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
		senha: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		tipo: {
			type: DataTypes.ENUM('aluno', 'admin'),
			defaultValue: 'aluno',
		},
	},
	{
		tableName: 'usuarios',
		timestamps: false,
	},
);

module.exports = Usuario;
