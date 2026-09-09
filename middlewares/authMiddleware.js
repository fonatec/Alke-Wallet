const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
  const encabezado = req.headers.authorization;

  if (!encabezado || !encabezado.startsWith('Bearer ')) {
    return res.status(401).json({
      status: 'error',
      message: 'Token de autenticación no proporcionado',
      data: null
    });
  }

  const token = encabezado.split(' ')[1];

  try {
    const datosToken = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = datosToken;
    next();
  } catch (error) {
    const mensaje =
      error.name === 'TokenExpiredError'
        ? 'El token ha expirado'
        : 'Token inválido';

    return res.status(401).json({
      status: 'error',
      message: mensaje,
      data: null
    });
  }
};

module.exports = {
  verificarToken
};