const Cart = require('../models/Cart')
const History = require('../models/History')
const User = require('../models/User')
const Product = require('../models/Product')
const {sucRes, failRes} = require('../helper/resFormat')

async function addToHistory (req, res){
    try {
        let cart = await Cart.findById(req.params.id)
        if(cart.customer != req.user) return res.status(400).json(failRes("Access Denied. Not Your Cart"))

        let user = await User.findById(req.user) //req.user is user active. req.user contain ID of user
        let history = await History.create({dateToCart: req.body.dateToCart, quantity: req.body.quantity, customer: req.body.customer, products: req.body.products})
        //console.log(history)

        user.histories.push(history)
        user.save()

        res.status(200).json(sucRes(user, "Add Cart to History Success"))
        //console.log(user)
    } catch (err) {
        return res.status(404).json(failRes(err.message, "Cart Id Not Found"))
    }
}
async function orderHistory(req, res){
   // try {
        let user = await User.findById(req.user)
        .select(['histories', 'username'])
        .populate('histories')
        res.status(200).json(sucRes(user, "Your Order History"))
    // } catch (err) {
    //     res.status(404).json(failRes(err, "wrong"))
    // }
}

module.exports = {addToHistory, orderHistory}

