const { Op } = require('sequelize');
const { Usuario, Movimiento } = require('../models');

// GET - Obtener todos los usuarios
const obtenerUsuarios = async (req, res) => {
  try {
    const { nombre } = req.query;

    const where = nombre
      ? {
          nombre: {
            [Op.iLike]: `%${nombre}%`
          }
        }
      : {};

    const usuarios = await Usuario.findAll({
      where,
      attributes: {
        exclude: ['password']
      },
      order: [['id', 'ASC']]
    });

    res.status(200).json({
      status: 'success',
      message: 'Usuarios obtenidos correctamente',
      data: usuarios
    });
  } catch (error) {
    console.error('Error al obtener usuarios:', error.message);

    res.status(500).json({
      status: 'error',
      message: 'Error al obtener los usuarios'
    });
  }
};

// POST - Crear usuario
const crearUsuario = async (req, res) => {
  try {
    const { nombre, email, password, saldo = 0 } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Nombre, email y password son obligatorios'
      });
    }

    const emailExiste = await Usuario.findOne({
      where: { email }
    });

    if (emailExiste) {
      return res.status(409).json({
        status: 'error',
        message: 'El email ya se encuentra registrado'
      });
    }

    const usuario = await Usuario.create({
      nombre,
      email,
      password,
      saldo
    });

    const usuarioCreado = usuario.toJSON();
    delete usuarioCreado.password;

    res.status(201).json({
      status: 'success',
      message: 'Usuario creado correctamente',
      data: usuarioCreado
    });
  } catch (error) {
    console.error('Error al crear usuario:', error.message);

    res.status(500).json({
      status: 'error',
      message: 'Error al crear el usuario'
    });
  }
};

// PUT - Actualizar usuario
const actualizarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, email } = req.body;

    if (!nombre || !email) {
      return res.status(400).json({
        status: 'error',
        message: 'Nombre y email son obligatorios'
      });
    }

    const usuario = await Usuario.findByPk(id);

    if (!usuario) {
      return res.status(404).json({
        status: 'error',
        message: 'Usuario no encontrado'
      });
    }

    const emailExiste = await Usuario.findOne({
      where: {
        email,
        id: {
          [Op.ne]: id
        }
      }
    });

    if (emailExiste) {
      return res.status(409).json({
        status: 'error',
        message: 'El email ya pertenece a otro usuario'
      });
    }

    await usuario.update({
      nombre,
      email
    });

    const usuarioActualizado = usuario.toJSON();
    delete usuarioActualizado.password;

    res.status(200).json({
      status: 'success',
      message: 'Usuario actualizado correctamente',
      data: usuarioActualizado
    });
  } catch (error) {
    console.error('Error al actualizar usuario:', error.message);

    res.status(500).json({
      status: 'error',
      message: 'Error al actualizar el usuario'
    });
  }
};

// DELETE - Eliminar usuario
const eliminarUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    const usuario = await Usuario.findByPk(id);

    if (!usuario) {
      return res.status(404).json({
        status: 'error',
        message: 'Usuario no encontrado'
      });
    }

    await usuario.destroy();

    res.status(200).json({
      status: 'success',
      message: 'Usuario eliminado correctamente'
    });
  } catch (error) {
    console.error('Error al eliminar usuario:', error.message);

    res.status(500).json({
      status: 'error',
      message: 'Error al eliminar el usuario'
    });
  }
};

// GET - Obtener un usuario con sus movimientos
const obtenerUsuarioConMovimientos = async (req, res) => {
  try {
    const { id } = req.params;

    const usuario = await Usuario.findByPk(id, {
      attributes: {
        exclude: ['password']
      },
      include: [
        {
          model: Movimiento,
          as: 'movimientos'
        }
      ]
    });

    if (!usuario) {
      return res.status(404).json({
        status: 'error',
        message: 'Usuario no encontrado'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Usuario y movimientos obtenidos correctamente',
      data: usuario
    });
  } catch (error) {
    console.error('Error al obtener movimientos:', error.message);

    res.status(500).json({
      status: 'error',
      message: 'Error al obtener el usuario y sus movimientos'
    });
  }
};

module.exports = {
  obtenerUsuarios,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
  obtenerUsuarioConMovimientos
};