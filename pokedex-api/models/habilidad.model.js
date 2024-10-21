const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const Habilidad = sequelize.define('Habilidad', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  timestamps: false
});

module.exports = Habilidad;
