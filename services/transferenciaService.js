const { sequelize, Usuario, Movimiento } = require('../models');

const realizarTransferencia = async (origenId, destinoId, monto) => {
  const transaction = await sequelize.transaction();

  try {
    const montoTransferencia = Number(monto);

    if (!montoTransferencia || montoTransferencia <= 0) {
      throw new Error('El monto debe ser mayor que cero');
    }

    if (Number(origenId) === Number(destinoId)) {
      throw new Error('El usuario de origen y destino no pueden ser iguales');
    }

    const usuarioOrigen = await Usuario.findByPk(origenId, {
      transaction,
      lock: transaction.LOCK.UPDATE
    });

    const usuarioDestino = await Usuario.findByPk(destinoId, {
      transaction,
      lock: transaction.LOCK.UPDATE
    });

    if (!usuarioOrigen || !usuarioDestino) {
      throw new Error('Usuario de origen o destino no encontrado');
    }

    if (Number(usuarioOrigen.saldo) < montoTransferencia) {
      throw new Error('Saldo insuficiente');
    }

    await usuarioOrigen.decrement('saldo', {
      by: montoTransferencia,
      transaction
    });

    await usuarioDestino.increment('saldo', {
      by: montoTransferencia,
      transaction
    });

    await Movimiento.bulkCreate(
      [
        {
          usuario_id: origenId,
          tipo: 'envio',
          monto: montoTransferencia,
          descripcion: `Transferencia enviada al usuario ${destinoId}`
        },
        {
          usuario_id: destinoId,
          tipo: 'recepcion',
          monto: montoTransferencia,
          descripcion: `Transferencia recibida del usuario ${origenId}`
        }
      ],
      { transaction }
    );

    await transaction.commit();

    return {
      origenId,
      destinoId,
      monto: montoTransferencia
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

module.exports = {
  realizarTransferencia
};