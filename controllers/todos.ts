export {};
const jwt = require('jsonwebtoken');
const user = require('../User');

const getTodos =async (req, res, next) => {
    const {username, token} = req.body;
    const userInDatabase = await user.findOne({username: username});
    const todos = userInDatabase.todos;
    res.status(200).json({todos});
}

const addTodo = async (req, res, next) => {
    const {username, token, todo} = req.body;
    const userInDatabase = await user.findOne({username: username});
    userInDatabase.todos.push(todo);
    await userInDatabase.save();
    res.status(200).json({todos: userInDatabase.todos});
}

const deleteTodo = async(req, res, next) => {
    const {username, token, todo} = req.body;
    const userInDatabase = await user.findOne({username: username});
    const todos = userInDatabase.todos;
    const index = todos.indexOf(todo);
    todos.splice(index, 1);
    await userInDatabase.save();
    res.status(200).json({todos: userInDatabase.todos});
}

const updateTodo = async (req, res, next) => {
    const {username, token, index, newTodo} = req.body;
    const userInDatabase = await user.findOne({username: username});
    const todos = userInDatabase.todos;
    todos[index] = newTodo;
    await userInDatabase.save();
    res.status(200).json({todos: userInDatabase.todos});
}

module.exports = {
    getTodos, 
    addTodo,
    deleteTodo,
    updateTodo
};