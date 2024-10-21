const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');
const Tipo = require('./tipo.model'); // Asegúrate de tener el modelo de Tipo
const Habilidad = require('./habilidad.model'); // Asegúrate de tener el modelo de Habilidad

const Pokemon = sequelize.define('Pokemon', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  nroPokedex: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  idTipo1: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  idTipo2: {
    type: DataTypes.INTEGER,
    allowNull: true  // El segundo tipo es opcional
  },
  idHabilidad1: {
    type: DataTypes.INTEGER,
    allowNull: true  // Primera habilidad, opcional
  },
  idHabilidad2: {
    type: DataTypes.INTEGER,
    allowNull: true  // Segunda habilidad, opcional
  },
  idHabilidad3: {
    type: DataTypes.INTEGER,
    allowNull: true  // Tercera habilidad, opcional
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  hp: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  attack: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  defense: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  spattack: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  spdefense: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  speed: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  nivelEvolucion: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  idEvPrevia: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  idEvSiguiente: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  imagen: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  timestamps: false  // Desactiva los campos `createdAt` y `updatedAt`
});

// Relaciones
Pokemon.belongsTo(Tipo, { as: 'Tipo1', foreignKey: 'idTipo1' });  // Relación con la tabla de Tipo (primer tipo)
Pokemon.belongsTo(Tipo, { as: 'Tipo2', foreignKey: 'idTipo2' });  // Relación con la tabla de Tipo (segundo tipo, opcional)
Pokemon.belongsTo(Habilidad, { as: 'Habilidad1', foreignKey: 'idHabilidad1' });  // Relación con la tabla de Habilidad (habilidad 1, opcional)
Pokemon.belongsTo(Habilidad, { as: 'Habilidad2', foreignKey: 'idHabilidad2' });  // Relación con la tabla de Habilidad (habilidad 2, opcional)
Pokemon.belongsTo(Habilidad, { as: 'Habilidad3', foreignKey: 'idHabilidad3' });  // Relación con la tabla de Habilidad (habilidad 3, opcional)

module.exports = Pokemon;
