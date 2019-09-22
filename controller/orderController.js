const Cart = require('../models/Cart')
const Order = require('../models/Order')
const User = require('../models/User')
const Product = require('../models/Product')
const {sucRes, failRes} = require('../helper/resFormat')

async function checkout(req, res){
    try {
        let order = await Order.findOneAndUpdate({customer: req.user, isDone: false}, {isDone: true}) //isDone in 2nd parameter to set result from false to true. is known as checkout
            .populate('products')

        Order.create({customer: req.user}) //automatic make a new field customer in collection order contain customer's id

        res.status(200).json(sucRes(order, "Checkout Success"))
    } catch (err) {
        return res.status(404).json(failRes(err.message, "Order Not Found"))
    }
}
async function orderHistory(req, res){
    try {
        let order = await Order.find({customer: req.user, isDone: true})
        .select(['orderDate', 'customer', 'products', 'isDone', 'totalPrice', '_id'])
        .populate({path: 'products', select: ['quantity', 'subTotal', '_id', 'product', 'toCartDate']})

        res.status(200).json(sucRes(order, "Your Order History"))
    } catch (err) {
        res.status(404).json(failRes(err, "You haven't order are done"))
    }
}

module.exports = {checkout, orderHistory}

