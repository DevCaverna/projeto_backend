const bcrypt = require('bcrypt');
const { Usuario } = require('../models');

const formularioLogin = (req, res) => {
	res.render('auth/login');
};

const realizarLogin = async (req, res) => {
	try {
		const { email, senha } = req.body;

		const usuario = await Usuario.findOne({ where: { email } });

		if (!usuario || !(await bcrypt.compare(senha, usuario.senha))) {
			return res.render('auth/login', {
				erro: 'E-mail ou senha inválidos.',
			});
		}

		req.session.usuario = {
			id: usuario.id,
			nome: usuario.nome,
			email: usuario.email,
			tipo: usuario.tipo,
		};

		if (usuario.tipo === 'admin') {
			return res.redirect('/admin/alunos');
		}
		res.redirect('/aluno/receitas');
	} catch (erro) {
		res.render('auth/login', {
			erro: 'Erro no servidor. Tente novamente.',
		});
	}
};

const realizarLogout = (req, res) => {
	req.session.destroy(() => {
		res.redirect('/');
	});
};

module.exports = { formularioLogin, realizarLogin, realizarLogout };
