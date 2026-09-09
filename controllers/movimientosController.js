const { Movimiento, Usuario } = require('../models');

const obtenerMovimientos = async (req, res) => {
  try {
    const { usuarioId, tipo } = req.query;
    const filtros = {};

    if (usuarioId) {
      filtros.usuario_id = usuarioId;
    }

    if (tipo) {
      filtros.tipo = tipo;
    }

    const movimientos = await Movimiento.findAll({
      where: filtros,
      order: [['created_at', 'DESC']]
    });

    res.status(200).json({
      status: 'success',
      message: 'Movimientos obtenidos correctamente',
      data: movimientos
    });
  } catch (error) {
    console.error('Error al obtener movimientos:', error.message);

    res.status(500).json({
      status: 'error',
      message: 'Error al obtener los movimientos',
      data: null
    });
  }
};

const crearMovimiento = async (req, res) => {
  try {
    const { usuario_id, tipo, monto, descripcion } = req.body;

    if (!usuario_id || !tipo || !monto) {
      return res.status(400).json({
        status: 'error',
        message: 'usuario_id, tipo y monto son obligatorios',
        data: null
      });
    }

    if (Number(monto) <= 0) {
      return res.status(400).json({
        status: 'error',
        message: 'El monto debe ser mayor que cero',
        data: null
      });
    }

    const usuario = await Usuario.findByPk(usuario_id);

    if (!usuario) {
      return res.status(404).json({
        status: 'error',
        message: 'Usuario no encontrado',
        data: null
      });
    }

    const movimiento = await Movimiento.create({
      usuario_id,
      tipo,
      monto,
      descripcion
    });

    res.status(201).json({
      status: 'success',
      message: 'Movimiento creado correctamente',
      data: movimiento
    });
  } catch (error) {
    console.error('Error al crear movimiento:', error.message);

    res.status(500).json({
      status: 'error',
      message: 'Error al crear el movimiento',
      data: null
    });
  }
};

const actualizarMovimiento = async (req, res) => {
  try {
    const { id } = req.params;
    const { tipo, monto, descripcion } = req.body;

    const movimiento = await Movimiento.findByPk(id);

    if (!movimiento) {
      return res.status(404).json({
        status: 'error',
        message: 'Movimiento no encontrado',
        data: null
      });
    }

    if (monto !== undefined && Number(monto) <= 0) {
      return res.status(400).json({
        status: 'error',
        message: 'El monto debe ser mayor que cero',
        data: null
      });
    }

    await movimiento.update({
      tipo: tipo ?? movimiento.tipo,
      monto: monto ?? movimiento.monto,
      descripcion: descripcion ?? movimiento.descripcion
    });

    res.status(200).json({
      status: 'success',
      message: 'Movimiento actualizado correctamente',
      data: movimiento
    });
  } catch (error) {
    console.error('Error al actualizar movimiento:', error.message);

    res.status(500).json({
      status: 'error',
      message: 'Error al actualizar el movimiento',
      data: null
    });
  }
};

const eliminarMovimiento = async (req, res) => {
  try {
    const { id } = req.params;
    const movimiento = await Movimiento.findByPk(id);

    if (!movimiento) {
      return res.status(404).json({
        status: 'error',
        message: 'Movimiento no encontrado',
        data: null
      });
    }

    await movimiento.destroy();

    res.status(200).json({
      status: 'success',
      message: 'Movimiento eliminado correctamente',
      data: null
    });
  } catch (error) {
    console.error('Error al eliminar movimiento:', error.message);

    res.status(500).json({
      status: 'error',
      message: 'Error al eliminar el movimiento',
      data: null
    });
  }
};

module.exports = {
  obtenerMovimientos,
  crearMovimiento,
  actualizarMovimiento,
  eliminarMovimiento
};