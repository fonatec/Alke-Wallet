const express = require('express');
require('dotenv').config();

const sequelize = require('./config/sequelize');
const usuariosRoutes = require('./routes/usuariosRoutes');
const transferenciasRoutes = require('./routes/transferenciasRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Alke Wallet Backend funcionando');
});

app.use('/usuarios', usuariosRoutes);
app.use('/transferencias', transferenciasRoutes);

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