const jwt = require('jsonwebtoken');

// Middleware para autenticação JWT
exports.auth = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ msg: 'Token não fornecido!' });

  jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ msg: 'Token inválido!' });
    req.user = decoded;
    next();
  });
};

// Middleware para permitir acesso apenas para determinados cargos
exports.permitirCargos = (...cargosPermitidos) => {
  return (req, res, next) => {
    if (!req.user || !cargosPermitidos.includes(req.user.cargo)) {
      return res.status(403).json({ msg: 'Acesso negado. Permissão insuficiente.' });
    }
    next();
  };
};
