const { STRING, BOOLEAN } = require('sequelize');
const db = require('./connection.js');

const Task = db.define('task', {
  title: {
    type: STRING,
    allowNull: false,
  },
  complete: {
    type: BOOLEAN,
    defaultValue: false,
  },
});

module.exports = Task;
