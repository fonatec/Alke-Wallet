const fs = require('fs');
const path = require('path');

const rutaLog = path.join(__dirname, '../logs/audit.log');

const registrarAuditoria = (req, res, next) => {
  const inicio = Date.now();

  res.on('finish', () => {
    const usuario = req.usuario
      ? req.usuario.email
      : 'anonimo';

    const registro = [
      new Date().toISOString(),
      req.method,
      req.originalUrl,
      res.statusCode,
      usuario,
      `${Date.now() - inicio}ms`
    ].join(' | ');

    fs.appendFile(rutaLog, `${registro}\n`, (error) => {
      if (error) {
        console.error(
          'Error al registrar la auditoría:',
          error.message
        );
      }
    });
  });

  next();
};

module.exports = {
  registrarAuditoria
};