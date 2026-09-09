const express = require('express');
require('dotenv').config();
const multer = require('multer');
const {
  registrarAuditoria
} = require('./middlewares/auditoriaMiddleware');
const sequelize = require('./config/sequelize');
const usuariosRoutes = require('./routes/usuariosRoutes');
const transferenciasRoutes = require('./routes/transferenciasRoutes');
const path = require('path');
const uploadRoutes = require('./routes/uploadRoutes');
const app = express();
const PORT = process.env.PORT || 3000;
const authRoutes = require('./routes/authRoutes');
const movimientosRoutes = require('./routes/movimientosRoutes');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(registrarAuditoria);
app.use(
  '/uploads',
  express.static(path.join(__dirname, 'uploads'))
);
app.get('/', (req, res) => {
  res.send('Alke Wallet Backend funcionando');
});
app.use('/', authRoutes);
app.use('/usuarios', usuariosRoutes);
app.use('/transferencias', transferenciasRoutes);
app.use('/movimientos', movimientosRoutes);
app.use('/upload', uploadRoutes);
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    const mensaje =
      error.code === 'LIMIT_FILE_SIZE'
        ? 'El archivo supera el tamaño máximo de 2 MB'
        : 'Error al procesar el archivo';

    return res.status(400).json({
      status: 'error',
      message: mensaje,
      data: null
    });
  }

  if (error.message === 'Tipo de archivo no permitido') {
    return res.status(400).json({
      status: 'error',
      message: error.message,
      data: null
    });
  }

  console.error('Error no controlado:', error.message);

  res.status(500).json({
    status: 'error',
    message: 'Error interno del servidor',
    data: null
  });
});

const iniciarServidor = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexión exitosa a PostgreSQL mediante Sequelize');

    app.listen(PORT, () => {
      console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error.message);
  }
};


iniciarServidor();