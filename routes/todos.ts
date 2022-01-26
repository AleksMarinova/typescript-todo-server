export {};

const todosController = require('../controllers/todos');
const express = require('express');
const router = express.Router();

router.get('/todos', todosController.getTodos);
router.post('/todos', todosController.addTodo);
router.delete('/todos', todosController.deleteTodo);
router.put('/todos', todosController.updateTodo);

module.exports = router;