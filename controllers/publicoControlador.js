const {
	Receita,
	Categoria,
	Habilidade,
	Usuario,
	AlunoHabilidade,
} = require('../models');

const paginaInicial = async (req, res) => {
	const categorias = await Categoria.findAll();
	const receitas = await Receita.findAll({
		include: [{ association: 'categorias' }, { association: 'alunos' }],
	});
	res.render('publico/inicio', {
		receitas: receitas.map((r) => r.get({ plain: true })),
		categorias: categorias.map((c) => c.get({ plain: true })),
	});
};

const receitasPorCategoria = async (req, res) => {
	const categoria = await Categoria.findByPk(req.params.id, {
		include: {
			association: 'receitas',
			include: [{ association: 'alunos' }],
		},
	});
	const categorias = await Categoria.findAll();
	res.render('publico/receitasPorCategoria', {
		categoria: categoria ? categoria.get({ plain: true }) : null,
		receitas: categoria
			? categoria.receitas.map((r) => r.get({ plain: true }))
			: [],
		categorias: categorias.map((c) => c.get({ plain: true })),
	});
};

const relatorioHabilidades = async (req, res) => {
	const totalAlunos = await Usuario.count({ where: { tipo: 'aluno' } });
	const habilidades = await Habilidade.findAll();

	const relatorio = [];

	for (const habilidade of habilidades) {
		// Conta quantos alunos possuem nível > 0 nesta habilidade
		const alunosComDominio = await AlunoHabilidade.count({
			where: {
				habilidade_id: habilidade.id,
				nivel: { [require('sequelize').Op.gt]: 0 },
			},
		});

		const porcentagem =
			totalAlunos > 0
				? ((alunosComDominio / totalAlunos) * 100).toFixed(1)
				: '0.0';

		relatorio.push({
			nome: habilidade.nome,
			alunosComDominio,
			totalAlunos,
			porcentagem,
		});
	}

	res.render('publico/relatorio', { relatorio });
};

module.exports = { paginaInicial, receitasPorCategoria, relatorioHabilidades };
