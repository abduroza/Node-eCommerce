const User = require('../models/User')
const {sucRes, failRes} = require('../helper/resFormat')
const bcrypt = require('bcrypt')
const saltRounds = 10
const jwt = require('jsonwebtoken')

async function register(req, res){
    try {
        let hash = await bcrypt.hash(req.body.password, saltRounds)
        let data = await User.create({firstname: req.body.firstname, lastname: req.body.lastname, username: req.body.username, email: req.body.email, password: hash, role: req.body.role})
        res.status(201).json(sucRes({firstname: data.firstname, lastname: data.lastname, username: data.username, email: data.email, role: data.role, _id: data._id}, "Register Success")) //if using data will show all, include password information. Thhis code to hidden password when send response
    } catch (err) {
        if(err) res.status(422).json(failRes(err.message, "please fill correctly"))
    }
}
async function login(req, res){
    let user = await User.findOne({$or: [{username: req.body.username}, {email: req.body.email}]})
    //user = user[0] //findOne produce object {}, but find produce array [{}]
    if(!user) {
        return res.status(404).json(failRes("Username or Email Not Found"))
    } else {
        try {
            let result = await bcrypt.compare(req.body.password, user.password)
            if(result == true){
               let token = await jwt.sign({_id: user._id}, 'r4h45145ek4l1')
               res.status(200).json(sucRes(token, "Login Success"))
            }
        } catch (err) {
            res.status(404).json(failRes(err, "Invalid Password"))
        }
    }
}
async function show(req, res){ //show user's account and user's product
    let user = await User.findById(req.user)
        .populate({
            path: 'products', //'products' same as field in user model
            select: ['_id', 'name', 'category', 'price', 'stock', 'description', 'condition', 'weight', 'date', 'user']
        })
    res.status(200).json(sucRes(user, "Below Your Data Account"))
}

module.exports = {register, login, show}
