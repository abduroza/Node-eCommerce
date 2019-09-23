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

        // if (data.role == 'customer') {
        //     Order.create({customer: data._id}) //otomatis membuat filed order yg berisi customer's
        // }
        Order.create({customer: data._id}) //automatic make a field customer in collection order contain customer's id
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

module.exports = {register, login, show, deleteUser}
