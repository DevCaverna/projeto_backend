const {
	Receita,
	Categoria,
	Habilidade,
	Usuario,
	AlunoHabilidade,
} = require('../models');
const { mongoose } = require('../config/bancoDeDados');
const Comentario = require('../models/Comentario');

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

const criarComentario = async (req, res) => {
	try {
		const { texto } = req.body;
		const { id } = req.params;
		if (!req.session.usuario) {
			return res
				.status(401)
				.send('Você precisa estar logado para comentar.');
		}
		const autorId = req.session.usuario.id;

		const comentario = new Comentario({
			texto,
			autor: autorId,
			receita: id,
		});

		await comentario.save();
		res.redirect(`/receitas/${id}`);
	} catch (error) {
		console.error('Erro ao criar comentário:', error);
		res.status(500).send('Erro ao criar comentário.');
	}
};

const exibirReceita = async (req, res) => {
	try {
		const { id } = req.params;
		const receita = await Receita.findByPk(id, {
			include: [{ association: 'categorias' }, { association: 'alunos' }],
		});

		if (!receita) {
			return res.status(404).send('Receita não encontrada.');
		}

		const comentarios = await Comentario.find({ receita: id }).lean();

		const comentariosComAutor = await Promise.all(
			comentarios.map(async (comentario) => {
				const autor = await Usuario.findByPk(comentario.autor, {
					attributes: ['id', 'nome', 'email'],
				});
				return {
					...comentario,
					autor: autor
						? autor.get({ plain: true })
						: { nome: 'Desconhecido' },
				};
			}),
		);

		res.render('publico/receitaDetalhe', {
			receita: receita.get({ plain: true }),
			comentarios: comentariosComAutor,
			usuario: req.session.usuario,
		});
	} catch (error) {
		console.error('Erro ao exibir receita:', error);
		res.status(500).send('Erro ao exibir receita.');
	}
};

module.exports = {
	paginaInicial,
	receitasPorCategoria,
	relatorioHabilidades,
	criarComentario,
	exibirReceita,
};
