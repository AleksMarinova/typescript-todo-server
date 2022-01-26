import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const user = require('../User');

const login = (req, res, next) => {
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
}

const register = (req, res, next) => {
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
}

module.exports = {login, register};