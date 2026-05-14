const bcrypt = require('bcrypt');
const {
	sequelize,
	Usuario,
	Categoria,
	Habilidade,
	Receita,
	AlunoHabilidade,
} = require('./models');

async function executarSeed() {
	await sequelize.sync({ force: true });

	const senhaAdmin = await bcrypt.hash('admin123', 10);
	const senhaAluno = await bcrypt.hash('123456', 10);

	const admin = await Usuario.create({
		nome: 'Administrador',
		email: 'admin@admin.com',
		senha: senhaAdmin,
		tipo: 'admin',
	});

	const aluno1 = await Usuario.create({
		nome: 'Maria Silva',
		email: 'maria@email.com',
		senha: senhaAluno,
		tipo: 'aluno',
	});
	const aluno2 = await Usuario.create({
		nome: 'João Santos',
		email: 'joao@email.com',
		senha: senhaAluno,
		tipo: 'aluno',
	});
	const aluno3 = await Usuario.create({
		nome: 'Luiz',
		email: 'luiz@email.com',
		senha: await bcrypt.hash('12345678', 10),
		tipo: 'aluno',
	});

	const cat1 = await Categoria.create({ nome: 'Massas' });
	const cat2 = await Categoria.create({ nome: 'Sobremesas' });
	const cat3 = await Categoria.create({ nome: 'Saladas' });

	const hab1 = await Habilidade.create({ nome: 'Corte' });
	const hab2 = await Habilidade.create({ nome: 'Tempero' });
	const hab3 = await Habilidade.create({ nome: 'Confeitaria' });

	const receita1 = await Receita.create({
		nome: 'Lasanha Bolonhesa',
		descricao: 'Lasanha com molho bolonhesa e queijo gratinado.',
		link_externo: 'https://exemplo.com/lasanha',
	});
	const receita2 = await Receita.create({
		nome: 'Bolo de Chocolate',
		descricao: 'Bolo fofinho de chocolate com cobertura.',
		link_externo: '',
	});

	await receita1.setCategorias([cat1.id]);
	await receita1.setAlunos([aluno1.id, aluno2.id]);

	await receita2.setCategorias([cat2.id]);
	await receita2.setAlunos([aluno2.id, aluno3.id]);

	await AlunoHabilidade.create({
		aluno_id: aluno1.id,
		habilidade_id: hab1.id,
		nivel: 7,
	});
	await AlunoHabilidade.create({
		aluno_id: aluno1.id,
		habilidade_id: hab2.id,
		nivel: 5,
	});
	await AlunoHabilidade.create({
		aluno_id: aluno2.id,
		habilidade_id: hab3.id,
		nivel: 9,
	});
	await AlunoHabilidade.create({
		aluno_id: aluno3.id,
		habilidade_id: hab2.id,
		nivel: 6,
	});

	console.log('Seed executado com sucesso!');
	process.exit(0);
}

executarSeed();
