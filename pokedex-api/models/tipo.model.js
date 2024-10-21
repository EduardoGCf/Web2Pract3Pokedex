const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const Tipo = sequelize.define('Tipo', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  imagen: {
    type: DataTypes.STRING, 
    allowNull: true
  },
}, {
  timestamps: false
});

module.exports = Tipo;
