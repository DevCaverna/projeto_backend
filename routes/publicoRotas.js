const express = require('express');
const roteador = express.Router();
const {
	paginaInicial,
	receitasPorCategoria,
	relatorioHabilidades,
} = require('../controllers/publicoControlador');

roteador.get('/', paginaInicial);
roteador.get('/categorias/:id/receitas', receitasPorCategoria);
roteador.get('/relatorio', relatorioHabilidades);

module.exports = roteador;
