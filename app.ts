import express, {Request, Response, NextFunction} from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from 'dotenv';
import morgan from 'morgan';
const user = require('./User');
const jwt = require('jsonwebtoken');

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


app.post('/api/auth/login', (req, res) => {
    const {username, password} = req.body;
    let accessToken = '';
    user.findOne({username})
        .then(user => {
            const pass = bcrypt.compareSync(password, user.password);
            if (pass) {
                accessToken = jwt.sign({id: user._id}, process.env.SECRET_KEY);
                res.json({
                    username: user.username,
                    accessToken});
            }
            else {
                res.status(401).json({message: 'Invalid credentials'});
            }
        })    
})


app.post('/api/auth/register', (req, res) => {
    console.log(req.body);
    const {username, password, email} = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = new user({
        username,
        password: hashedPassword,
        email
    });
    newUser.save()
        .then(() => res.json("user created"));
})

process.on('SIGINT', () => {
    mongoose.connection.close(() => {
        console.log('Disconnected from MongoDB');
        process.exit(0);
    });
});
