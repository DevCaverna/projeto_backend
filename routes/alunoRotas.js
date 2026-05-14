const express = require('express');
const roteador = express.Router();
const {
	verificarLogin,
	verificarAluno,
} = require('../middlewares/autenticacao');
const aluno = require('../controllers/alunoControlador');

roteador.use(verificarLogin, verificarAluno);

roteador.get('/receitas', aluno.listarReceitas);
roteador.get('/receitas/cadastrar', aluno.formularioCadastroReceita);
roteador.post('/receitas/cadastrar', aluno.cadastrarReceita);
roteador.get('/receitas/editar/:id', aluno.formularioEditarReceita);
roteador.post('/receitas/editar/:id', aluno.editarReceita);
roteador.post('/receitas/excluir/:id', aluno.excluirReceita);

roteador.get('/habilidades', aluno.listarMinhasHabilidades);
roteador.get('/habilidades/adicionar', aluno.formularioAdicionarHabilidade);
roteador.post('/habilidades/adicionar', aluno.adicionarHabilidade);
roteador.get('/habilidades/editar/:id', aluno.formularioEditarHabilidade);
roteador.post('/habilidades/editar/:id', aluno.editarNivelHabilidade);
roteador.post('/habilidades/remover/:id', aluno.removerHabilidade);

module.exports = roteador;
