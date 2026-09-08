const sequelize = require('../config/sequelize');
const Usuario = require('./Usuario');
const Movimiento = require('./Movimiento');

Usuario.hasMany(Movimiento, {
  foreignKey: 'usuario_id',
  as: 'movimientos'
});

Movimiento.belongsTo(Usuario, {
  foreignKey: 'usuario_id',
  as: 'usuario'
});

module.exports = {
  sequelize,
  Usuario,
  Movimiento
};
