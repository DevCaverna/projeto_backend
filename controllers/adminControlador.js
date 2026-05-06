const bcrypt = require('bcrypt');
const { Usuario, Categoria, Habilidade } = require('../models');

// ===================== ALUNOS =====================

const listarAlunos = async (req, res) => {
	const alunos = await Usuario.findAll({ where: { tipo: 'aluno' } });
	res.render('admin/alunos/listar', {
		alunos: alunos.map((a) => a.get({ plain: true })),
	});
};

const formularioCadastroAluno = (req, res) => {
	res.render('admin/alunos/cadastrar');
};

const cadastrarAluno = async (req, res) => {
	try {
		const { nome, email, senha } = req.body;
		const senhaHash = await bcrypt.hash(senha, 10);
		await Usuario.create({ nome, email, senha: senhaHash, tipo: 'aluno' });
		res.redirect('/admin/alunos');
	} catch (erro) {
		res.render('admin/alunos/cadastrar', {
			erro: 'Erro ao cadastrar: E-mail já existe ou dados inválidos.',
		});
	}
};

const formularioEditarAluno = async (req, res) => {
	const aluno = await Usuario.findByPk(req.params.id);
	res.render('admin/alunos/editar', { aluno: aluno.get({ plain: true }) });
};

const editarAluno = async (req, res) => {
	try {
		const { nome, email, senha } = req.body;
		const dados = { nome, email };
		if (senha) {
			dados.senha = await bcrypt.hash(senha, 10);
		}
		await Usuario.update(dados, { where: { id: req.params.id } });
		res.redirect('/admin/alunos');
	} catch (erro) {
		const aluno = await Usuario.findByPk(req.params.id);
		res.render('admin/alunos/editar', {
			aluno: aluno ? aluno.get({ plain: true }) : null,
			erro: 'Erro ao editar: E-mail já em uso ou dados inválidos.',
		});
	}
};

const excluirAluno = async (req, res) => {
	await Usuario.destroy({ where: { id: req.params.id } });
	res.redirect('/admin/alunos');
};

// ===================== CATEGORIAS =====================

const listarCategorias = async (req, res) => {
	const categorias = await Categoria.findAll();
	res.render('admin/categorias/listar', {
		categorias: categorias.map((c) => c.get({ plain: true })),
	});
};

const formularioCadastroCategoria = (req, res) => {
	res.render('admin/categorias/cadastrar');
};

const cadastrarCategoria = async (req, res) => {
	try {
		await Categoria.create({ nome: req.body.nome });
		res.redirect('/admin/categorias');
	} catch (erro) {
		res.render('admin/categorias/cadastrar', {
			erro: 'Erro ao cadastrar categoria.',
		});
	}
};

const formularioEditarCategoria = async (req, res) => {
	const categoria = await Categoria.findByPk(req.params.id);
	res.render('admin/categorias/editar', {
		categoria: categoria.get({ plain: true }),
	});
};

const editarCategoria = async (req, res) => {
	try {
		await Categoria.update(
			{ nome: req.body.nome },
			{ where: { id: req.params.id } },
		);
		res.redirect('/admin/categorias');
	} catch (erro) {
		const categoria = await Categoria.findByPk(req.params.id);
		res.render('admin/categorias/editar', {
			categoria: categoria ? categoria.get({ plain: true }) : null,
			erro: 'Erro ao editar categoria.',
		});
	}
};

const excluirCategoria = async (req, res) => {
	await Categoria.destroy({ where: { id: req.params.id } });
	res.redirect('/admin/categorias');
};

// ===================== HABILIDADES =====================

const listarHabilidades = async (req, res) => {
	const habilidades = await Habilidade.findAll();
	res.render('admin/habilidades/listar', {
		habilidades: habilidades.map((h) => h.get({ plain: true })),
	});
};

const formularioCadastroHabilidade = (req, res) => {
	res.render('admin/habilidades/cadastrar');
};

const cadastrarHabilidade = async (req, res) => {
	try {
		await Habilidade.create({ nome: req.body.nome });
		res.redirect('/admin/habilidades');
	} catch (erro) {
		res.render('admin/habilidades/cadastrar', {
			erro: 'Erro ao cadastrar habilidade.',
		});
	}
};

const formularioEditarHabilidade = async (req, res) => {
	const habilidade = await Habilidade.findByPk(req.params.id);
	res.render('admin/habilidades/editar', {
		habilidade: habilidade.get({ plain: true }),
	});
};

const editarHabilidade = async (req, res) => {
	try {
		await Habilidade.update(
			{ nome: req.body.nome },
			{ where: { id: req.params.id } },
		);
		res.redirect('/admin/habilidades');
	} catch (erro) {
		const habilidade = await Habilidade.findByPk(req.params.id);
		res.render('admin/habilidades/editar', {
			habilidade: habilidade ? habilidade.get({ plain: true }) : null,
			erro: 'Erro ao editar habilidade.',
		});
	}
};

const excluirHabilidade = async (req, res) => {
	await Habilidade.destroy({ where: { id: req.params.id } });
	res.redirect('/admin/habilidades');
};

module.exports = {
	listarAlunos,
	formularioCadastroAluno,
	cadastrarAluno,
	formularioEditarAluno,
	editarAluno,
	excluirAluno,
	listarCategorias,
	formularioCadastroCategoria,
	cadastrarCategoria,
	formularioEditarCategoria,
	editarCategoria,
	excluirCategoria,
	listarHabilidades,
	formularioCadastroHabilidade,
	cadastrarHabilidade,
	formularioEditarHabilidade,
	editarHabilidade,
	excluirHabilidade,
};
