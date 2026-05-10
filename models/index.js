const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/bancoDeDados');
const Usuario = require('./Usuario');
const Receita = require('./Receita');
const Categoria = require('./Categoria');
const Habilidade = require('./Habilidade');

// N:N — Receita pertence a várias categorias e vice-versa
const ReceitaCategoria = sequelize.define(
	'ReceitaCategoria',
	{},
	{
		tableName: 'receita_categoria',
		timestamps: false,
	},
);

Receita.belongsToMany(Categoria, {
	through: ReceitaCategoria,
	foreignKey: 'receita_id',
	otherKey: 'categoria_id',
	as: 'categorias',
});

Categoria.belongsToMany(Receita, {
	through: ReceitaCategoria,
	foreignKey: 'categoria_id',
	otherKey: 'receita_id',
	as: 'receitas',
});

// N:N — Receita pertence a vários alunos (coautoria) e vice-versa
const ReceitaAluno = sequelize.define(
	'ReceitaAluno',
	{},
	{
		tableName: 'receita_aluno',
		timestamps: false,
	},
);

Receita.belongsToMany(Usuario, {
	through: ReceitaAluno,
	foreignKey: 'receita_id',
	otherKey: 'aluno_id',
	as: 'alunos',
});

Usuario.belongsToMany(Receita, {
	through: ReceitaAluno,
	foreignKey: 'aluno_id',
	otherKey: 'receita_id',
	as: 'receitas',
});

// N:N — Aluno possui várias habilidades com nível de 0 a 10
const AlunoHabilidade = sequelize.define(
	'AlunoHabilidade',
	{
		nivel: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
			validate: {
				min: 0,
				max: 10,
			},
		},
	},
	{
		tableName: 'aluno_habilidade',
		timestamps: false,
	},
);

Usuario.belongsToMany(Habilidade, {
	through: AlunoHabilidade,
	foreignKey: 'aluno_id',
	otherKey: 'habilidade_id',
	as: 'habilidades',
});

Habilidade.belongsToMany(Usuario, {
	through: AlunoHabilidade,
	foreignKey: 'habilidade_id',
	otherKey: 'aluno_id',
	as: 'alunos',
});

module.exports = {
	sequelize,
	Usuario,
	Receita,
	Categoria,
	Habilidade,
	ReceitaCategoria,
	ReceitaAluno,
	AlunoHabilidade,
};
