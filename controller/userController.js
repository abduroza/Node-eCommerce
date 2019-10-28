const User = require('../models/User')
const Product = require('../models/Product')
const Cart = require('../models/Cart')
const Order = require('../models/Order')
const {sucRes, failRes} = require('../helper/resFormat')
const bcrypt = require('bcrypt')
const saltRounds = 10
const jwt = require('jsonwebtoken')

async function register(req, res){
    try {
        let hash = await bcrypt.hash(req.body.password, saltRounds)
        let data = await User.create({firstname: req.body.firstname, lastname: req.body.lastname, username: req.body.username, email: req.body.email, password: hash, role: req.body.role})

        let token = await jwt.sign({_id: data._id, username: data.username, email: data.email, role: data.role}, process.env.TOKEN_SECRET) //after register automatically generate token/login
        let result = {_id: data._id, firstname: data.firstname, lastname: data.lastname, username: data.username, email: data.email, role: data.role, token: token}

        // if (data.role == 'customer') {
        //     Order.create({customer: data._id}) //otomatis membuat filed order yg berisi customer's
        // }
        Order.create({customer: data._id}) //automatic make a field customer in collection order contain customer's id
        res.status(201).json(sucRes(result, "Register Success")) //if using data will show all, include password information. Thhis code to hidden password when send response
    } catch (err) {
        res.status(422).json(failRes(err.message, "please fill correctly"))
    }
}

async function userUpdate(req, res){
    try {
        if (req.body.password != null){
            let hash = await bcrypt.hash(req.body.password, saltRounds)
            req.body['password'] = hash
        }

        let user = await User.findByIdAndUpdate(req.user, req.body)
        let userData = {_id: user._id, firstname: user.firstname, lastname: user.lastname, username: user.username, email: user.email, role: user.role, registerDate: user.registerDate}

        res.status(200).json(sucRes(userData, 'Update user success'))
    } catch (err) {
        res.status(400).json(failRes(err.message, "Update fail"))
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
               let token = await jwt.sign({_id: user._id, username: user.username, email: user.email, role: user.role}, process.env.TOKEN_SECRET)

               let dataLogin = {
                    _id:   user._id,
                    role:   user.role,
                    username: user.username,
                    email:   user.email,
                    token:   token
               }
               res.status(200).json(sucRes(dataLogin, "Login Success"))
            }
        } catch (err) {
            res.status(404).json(failRes(err, "Invalid Password"))
        }
    }
}
async function show(req, res){ //show user's account and user's product
    let user = await User.findById(req.user)
    res.status(200).json(sucRes(user, "Below Your Data Account"))
}
async function deleteUser(req, res){ //delete user's carts, user's orders, user's products, and an user
    try {
        let cart = await Cart.deleteMany({customer: req.user})
        let order = await Order.deleteMany({customer: req.user})
        let product = await Product.deleteMany({merchant: req.user})
        let user = await User.findByIdAndDelete(req.user)
        res.status(200).json(sucRes(user, "Delete an User Success"))
    } catch (err) {
        res.status(400).json(failRes(err.message, "delete fail"))
    }
}

module.exports = {register, userUpdate, login, show, deleteUser}
