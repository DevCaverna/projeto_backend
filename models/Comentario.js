const mongoose = require('mongoose');

const ComentarioSchema = new mongoose.Schema({
	texto: {
		type: String,
		required: true,
	},
	autor: {
		type: Number,
		ref: 'Usuario',
		required: true,
	},
	receita: {
		type: Number,
		ref: 'Receita',
		required: true,
	},
	dataCriacao: {
		type: Date,
		default: Date.now,
	},
});

const Comentario = mongoose.model('Comentario', ComentarioSchema);

module.exports = Comentario;
