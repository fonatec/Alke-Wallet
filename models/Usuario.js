const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Usuario = sequelize.define(
  'Usuario',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    saldo: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0
    }
  },
  {
    tableName: 'usuarios',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
  }
);

module.exports = Usuario;