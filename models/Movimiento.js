const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Movimiento = sequelize.define(
  'Movimiento',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'usuarios',
        key: 'id'
      }
    },
    tipo: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    monto: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false
    },
    descripcion: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  },
  {
    tableName: 'movimientos',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
  }
);

module.exports = Movimiento;