const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Email y contraseña son obligatorios',
        data: null
      });
    }

    const usuario = await Usuario.findOne({
      where: { email }
    });

    if (!usuario || usuario.password !== password) {
      return res.status(401).json({
        status: 'error',
        message: 'Credenciales incorrectas',
        data: null
      });
    }

    const token = jwt.sign(
      {
        id: usuario.id,
        email: usuario.email
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || '1h'
      }
    );

    return res.status(200).json({
      status: 'success',
      message: 'Inicio de sesión exitoso',
      data: {
        usuario: {
          id: usuario.id,
          nombre: usuario.nombre,
          email: usuario.email
        },
        token
      }
    });
  } catch (error) {
    console.error('Error al iniciar sesión:', error.message);

    return res.status(500).json({
      status: 'error',
      message: 'Error interno del servidor',
      data: null
    });
  }
};

module.exports = {
  login
};