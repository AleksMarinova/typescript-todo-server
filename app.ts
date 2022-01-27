import express, {Request, Response, NextFunction} from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from 'dotenv';
import morgan from 'morgan';
import { ppid } from "process";
const user = require('./User');
const jwt = require('jsonwebtoken');
const authRoutes = require('./routes/auth');
const todosRoutes = require('./routes/todos');
import authenticateToken from "./utilities";

const app = express();
const PORT = process.env.PORT || 5000;
dotenv.config();
app.use(cors());
app.use(bodyParser.json());
app.use(morgan('dev'));

const DB_URL = process.env.DB_URL;

mongoose.connect(DB_URL)
    .then(res => app.listen(PORT, () => console.log(`Server started on port ${PORT}`)))
    .catch(err => console.log(err));


app.use('/api/auth', authRoutes);
app.use('/api/todos', authenticateToken, todosRoutes);


process.on('SIGINT', () => {
    mongoose.connection.close(() => {
        console.log('Disconnected from MongoDB');
        process.exit(0);
    });
});
