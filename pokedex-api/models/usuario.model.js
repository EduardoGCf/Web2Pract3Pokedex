const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const Usuario = sequelize.define('Usuario', {
  IdUsuario: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  UserName: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  Password: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  timestamps: false
});

module.exports = Usuario;
