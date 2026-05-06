function verificarLogin(req, res, next) {
	if (!req.session.usuario) {
		return res.redirect('/login');
	}
	next();
}

function verificarAdmin(req, res, next) {
	if (!req.session.usuario || req.session.usuario.tipo !== 'admin') {
		return res.redirect('/');
	}
	next();
}

module.exports = { verificarLogin, verificarAdmin };
