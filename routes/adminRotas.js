const express = require('express');
const roteador = express.Router();
const {
	verificarLogin,
	verificarAdmin,
} = require('../middlewares/autenticacao');
const admin = require('../controllers/adminControlador');

roteador.use(verificarLogin, verificarAdmin);

roteador.get('/alunos', admin.listarAlunos);
roteador.get('/alunos/cadastrar', admin.formularioCadastroAluno);
roteador.post('/alunos/cadastrar', admin.cadastrarAluno);
roteador.get('/alunos/editar/:id', admin.formularioEditarAluno);
roteador.post('/alunos/editar/:id', admin.editarAluno);
roteador.post('/alunos/excluir/:id', admin.excluirAluno);

roteador.get('/categorias', admin.listarCategorias);
roteador.get('/categorias/cadastrar', admin.formularioCadastroCategoria);
roteador.post('/categorias/cadastrar', admin.cadastrarCategoria);
roteador.get('/categorias/editar/:id', admin.formularioEditarCategoria);
roteador.post('/categorias/editar/:id', admin.editarCategoria);
roteador.post('/categorias/excluir/:id', admin.excluirCategoria);

roteador.get('/habilidades', admin.listarHabilidades);
roteador.get('/habilidades/cadastrar', admin.formularioCadastroHabilidade);
roteador.post('/habilidades/cadastrar', admin.cadastrarHabilidade);
roteador.get('/habilidades/editar/:id', admin.formularioEditarHabilidade);
roteador.post('/habilidades/editar/:id', admin.editarHabilidade);
roteador.post('/habilidades/excluir/:id', admin.excluirHabilidade);

module.exports = roteador;
