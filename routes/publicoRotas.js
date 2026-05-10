const express = require('express');
const roteador = express.Router();
const {
	paginaInicial,
	receitasPorCategoria,
	relatorioHabilidades,
	criarComentario,
	exibirReceita,
} = require('../controllers/publicoControlador');

roteador.get('/', paginaInicial);
roteador.get('/categorias/:id/receitas', receitasPorCategoria);
roteador.get('/relatorio', relatorioHabilidades);
roteador.post('/receitas/:id/comentarios', criarComentario);
roteador.get('/receitas/:id', exibirReceita);

module.exports = roteador;
