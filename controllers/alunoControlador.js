const {
	Receita,
	Categoria,
	Usuario,
	Habilidade,
	AlunoHabilidade,
} = require('../models');

const carregarDadosFormularioReceita = async () => {
	const [categorias, alunos] = await Promise.all([
		Categoria.findAll(),
		Usuario.findAll({ where: { tipo: 'aluno' } }),
	]);

	return {
		categorias: categorias.map((c) => c.get({ plain: true })),
		alunos: alunos.map((a) => a.get({ plain: true })),
	};
};

const buscarReceitaDoAluno = async (receitaId, alunoId) => {
	const receita = await Receita.findByPk(receitaId, {
		include: [{ association: 'categorias' }, { association: 'alunos' }],
	});

	if (!receita) {
		return null;
	}

	const receitaPlain = receita.get({ plain: true });
	const participaDaReceita = receitaPlain.alunos.some(
		(aluno) => aluno.id === alunoId,
	);

	return participaDaReceita ? receitaPlain : null;
};

// ===================== RECEITAS =====================

const listarReceitas = async (req, res) => {
	const receitas = await Receita.findAll({
		include: [{ association: 'categorias' }, { association: 'alunos' }],
	});

	res.render('aluno/receitas/listar', {
		receitas: receitas
			.map((r) => r.get({ plain: true }))
			.filter((receita) =>
				receita.alunos.some(
					(aluno) => aluno.id === req.session.usuario.id,
				),
			),
	});
};

const formularioCadastroReceita = async (req, res) => {
	const { categorias, alunos } = await carregarDadosFormularioReceita();
	res.render('aluno/receitas/cadastrar', {
		categorias,
		alunos,
	});
};

const cadastrarReceita = async (req, res) => {
	try {
		const { nome, descricao, link_externo, categorias, alunos } = req.body;
		const receita = await Receita.create({ nome, descricao, link_externo });

		if (categorias) {
			const ids = Array.isArray(categorias) ? categorias : [categorias];
			await receita.setCategorias(ids);
		}

		let idsAlunos = alunos
			? Array.isArray(alunos)
				? alunos.map(Number)
				: [Number(alunos)]
			: [];
		if (!idsAlunos.includes(req.session.usuario.id)) {
			idsAlunos.push(req.session.usuario.id);
		}
		await receita.setAlunos(idsAlunos);

		res.redirect('/aluno/receitas');
	} catch (erro) {
		const { categorias, alunos } = await carregarDadosFormularioReceita();
		res.render('aluno/receitas/cadastrar', {
			categorias,
			alunos,
			erro: 'Erro ao cadastrar receita. Verifique os campos.',
		});
	}
};

const formularioEditarReceita = async (req, res) => {
	const receita = await buscarReceitaDoAluno(
		req.params.id,
		req.session.usuario.id,
	);

	if (!receita) {
		return res.redirect('/aluno/receitas');
	}

	const { categorias, alunos } = await carregarDadosFormularioReceita();
	const categoriasIds = receita.categorias.map((c) => c.id);
	const alunosIds = receita.alunos.map((a) => a.id);

	res.render('aluno/receitas/editar', {
		receita,
		categorias,
		alunos,
		categoriasIds,
		alunosIds,
	});
};

const editarReceita = async (req, res) => {
	try {
		const receitaAutorizada = await buscarReceitaDoAluno(
			req.params.id,
			req.session.usuario.id,
		);

		if (!receitaAutorizada) {
			return res.redirect('/aluno/receitas');
		}

		const { nome, descricao, link_externo, categorias, alunos } = req.body;
		await Receita.update(
			{ nome, descricao, link_externo },
			{ where: { id: req.params.id } },
		);

		const receita = await Receita.findByPk(req.params.id);

		if (categorias) {
			const ids = Array.isArray(categorias) ? categorias : [categorias];
			await receita.setCategorias(ids);
		} else {
			await receita.setCategorias([]);
		}

		let idsAlunos = alunos
			? Array.isArray(alunos)
				? alunos.map(Number)
				: [Number(alunos)]
			: [];
		if (!idsAlunos.includes(req.session.usuario.id)) {
			idsAlunos.push(req.session.usuario.id);
		}
		await receita.setAlunos(idsAlunos);

		res.redirect('/aluno/receitas');
	} catch (erro) {
		const receita = await buscarReceitaDoAluno(
			req.params.id,
			req.session.usuario.id,
		);
		const { categorias, alunos } = await carregarDadosFormularioReceita();

		if (!receita) {
			return res.redirect('/aluno/receitas');
		}

		res.render('aluno/receitas/editar', {
			receita,
			categorias,
			alunos,
			categoriasIds: receita.categorias.map((categoria) => categoria.id),
			alunosIds: receita.alunos.map((aluno) => aluno.id),
			erro: 'Erro ao editar receita. Verifique os campos.',
		});
	}
};

const excluirReceita = async (req, res) => {
	const receita = await buscarReceitaDoAluno(
		req.params.id,
		req.session.usuario.id,
	);

	if (!receita) {
		return res.redirect('/aluno/receitas');
	}

	await Receita.destroy({ where: { id: req.params.id } });
	res.redirect('/aluno/receitas');
};

// ===================== HABILIDADES DO ALUNO =====================

const listarMinhasHabilidades = async (req, res) => {
	const usuario = await Usuario.findByPk(req.session.usuario.id, {
		include: { association: 'habilidades' },
	});
	res.render('aluno/habilidades/listar', {
		habilidades: usuario.habilidades.map((h) => h.get({ plain: true })),
	});
};

const formularioAdicionarHabilidade = async (req, res) => {
	const usuario = await Usuario.findByPk(req.session.usuario.id, {
		include: { association: 'habilidades' },
	});
	const idsJaPossui = usuario.habilidades.map((h) => h.id);
	const habilidadesDisponiveis = await Habilidade.findAll({
		where:
			idsJaPossui.length > 0
				? { id: { [require('sequelize').Op.notIn]: idsJaPossui } }
				: {},
	});
	res.render('aluno/habilidades/adicionar', {
		habilidades: habilidadesDisponiveis.map((h) => h.get({ plain: true })),
	});
};

const adicionarHabilidade = async (req, res) => {
	try {
		const { habilidade_id, nivel } = req.body;
		await AlunoHabilidade.create({
			aluno_id: req.session.usuario.id,
			habilidade_id: Number(habilidade_id),
			nivel: Number(nivel),
		});
		res.redirect('/aluno/habilidades');
	} catch (erro) {
		res.redirect('/aluno/habilidades');
	}
};

const formularioEditarHabilidade = async (req, res) => {
	const registro = await AlunoHabilidade.findOne({
		where: {
			aluno_id: req.session.usuario.id,
			habilidade_id: req.params.id,
		},
	});
	const habilidade = await Habilidade.findByPk(req.params.id);
	res.render('aluno/habilidades/editar', {
		habilidade: habilidade.get({ plain: true }),
		nivel: registro.nivel,
	});
};

const editarNivelHabilidade = async (req, res) => {
	try {
		await AlunoHabilidade.update(
			{ nivel: Number(req.body.nivel) },
			{
				where: {
					aluno_id: req.session.usuario.id,
					habilidade_id: req.params.id,
				},
			},
		);
		res.redirect('/aluno/habilidades');
	} catch (erro) {
		res.redirect('/aluno/habilidades');
	}
};

const removerHabilidade = async (req, res) => {
	await AlunoHabilidade.destroy({
		where: {
			aluno_id: req.session.usuario.id,
			habilidade_id: req.params.id,
		},
	});
	res.redirect('/aluno/habilidades');
};

module.exports = {
	listarReceitas,
	formularioCadastroReceita,
	cadastrarReceita,
	formularioEditarReceita,
	editarReceita,
	excluirReceita,
	listarMinhasHabilidades,
	formularioAdicionarHabilidade,
	adicionarHabilidade,
	formularioEditarHabilidade,
	editarNivelHabilidade,
	removerHabilidade,
};
