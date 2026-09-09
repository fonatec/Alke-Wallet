const multer = require('multer');
const path = require('path');

const almacenamiento = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },

  filename: (req, file, cb) => {
    const nombreUnico =
      Date.now() + '-' + Math.round(Math.random() * 1e9);

    cb(
      null,
      nombreUnico + path.extname(file.originalname).toLowerCase()
    );
  }
});

const filtroArchivos = (req, file, cb) => {
  const tiposPermitidos = [
    'image/jpeg',
    'image/png',
    'image/webp'
  ];

  if (tiposPermitidos.includes(file.mimetype)) {
    return cb(null, true);
  }

  cb(new Error('Tipo de archivo no permitido'));
};

const upload = multer({
  storage: almacenamiento,
  fileFilter: filtroArchivos,
  limits: {
    fileSize: 2 * 1024 * 1024
  }
});

module.exports = upload;
