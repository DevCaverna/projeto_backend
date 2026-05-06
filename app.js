const express = require('express');
const { engine } = require('express-handlebars');
const session = require('express-session');
const { sequelize } = require('./models');

const app = express();

app.engine(
	'hbs',
	engine({
		extname: '.hbs',
		defaultLayout: 'principal',
		helpers: {
			eq: (a, b) => a === b,
			includes: (arr, val) => Array.isArray(arr) && arr.includes(val),
		},
	}),
);
app.set('view engine', 'hbs');
app.set('views', './views');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
	session({
		secret: 'chave-secreta-projeto-receitas',
		resave: false,
		saveUninitialized: false,
	}),
);

app.use((req, res, next) => {
	res.locals.usuario = req.session.usuario || null;
	next();
});

const publicoRotas = require('./routes/publicoRotas');
const authRotas = require('./routes/authRotas');
const adminRotas = require('./routes/adminRotas');
const alunoRotas = require('./routes/alunoRotas');

app.use('/', publicoRotas);
app.use('/', authRotas);
app.use('/admin', adminRotas);
app.use('/aluno', alunoRotas);

const PORTA = 3000;

sequelize.sync().then(() => {
	app.listen(PORTA, () => {
		console.log(`Servidor rodando em http://localhost:${PORTA}`);
	});
});
