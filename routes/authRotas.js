const express = require('express');
const roteador = express.Router();
const {
	formularioLogin,
	realizarLogin,
	realizarLogout,
} = require('../controllers/authControlador');

roteador.get('/login', formularioLogin);
roteador.post('/login', realizarLogin);
roteador.get('/logout', realizarLogout);

module.exports = roteador;
