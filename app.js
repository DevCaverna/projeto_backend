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
			formatDate: (date) => {
				const d = new Date(date);
				const day = String(d.getDate()).padStart(2, '0');
				const month = String(d.getMonth() + 1).padStart(2, '0');
				const year = d.getFullYear();
				const hours = String(d.getHours()).padStart(2, '0');
				const minutes = String(d.getMinutes()).padStart(2, '0');
				return `${day}/${month}/${year} ${hours}:${minutes}`;
			},
		},
	}),
);
app.set('view engine', 'hbs');
app.set('views', './views');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
	session({
		secret: '8b3af8118df1b443c3d1af345f08a983024057b39a925e2b1c3b75462c5f3785',
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
