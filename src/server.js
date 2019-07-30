const express = require('express');
const { models: { Task } } = require('./db/index.js');
const app = express();

app.use(express.json());

app.post('/tasks', async (req, res) => {
  const { title } = req.body;

  const task = await Task.create({
    title,
  });

  res.send(task);
});

app.get('/tasks', async (req, res) => {
  const tasks = await Task.findAll();

  res.send({ tasks });
});

app.get('/health', (req, res) => {
  res.send({ message: 'I am healthy' });
});

module.exports = app;
