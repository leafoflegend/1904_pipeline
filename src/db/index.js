const db = require('./connection.js');
const Task = require('./task.js');

module.exports = {
  db,
  models: {
    Task,
  },
};
