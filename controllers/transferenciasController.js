const {
  realizarTransferencia
} = require('../services/transferenciaService');

const transferir = async (req, res) => {
  try {
    const { origenId, destinoId, monto } = req.body;

    if (!origenId || !destinoId || !monto) {
      return res.status(400).json({
        status: 'error',
        message: 'Origen, destino y monto son obligatorios'
      });
    }

    const resultado = await realizarTransferencia(
      origenId,
      destinoId,
      monto
    );

    res.status(201).json({
      status: 'success',
      message: 'Transferencia realizada correctamente',
      data: resultado
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

module.exports = {
  transferir
};