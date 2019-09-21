const Cart = require('../models/Cart')
const User = require('../models/User')
const Product = require('../models/Product')
const {sucRes, failRes} = require('../helper/resFormat')

async function addToCart(req, res){
    try {
        let cart = await Cart.create(req.body)
        let product = await Product.findById(req.params.id)
        let user = await User.findById(req.user) //req.user is user active. req.user contain user id

        cart.customer = req.user //insert customer id into field customer's cart. field customer is an object
        cart.products.push(product) //insert product into field products's cart. field products is an array
        cart.save()
        user.carts.push(cart)
        user.save()

        res.status(200).json(sucRes(cart, "Success Add To Cart"))
    } catch (err) {
        res.status(404).json(failRes(err, "product not found"))
    }
}

async function showOrder(req, res){
    //let user = await User.findById(req.user)
    try {
        let cart = await Cart.findById(req.params.id).populate('products')
        if (cart.customer != req.user){
            return res.status(400).json(failRes("Access Denied. This isn't Your Cart"))
        } else {
            res.status(200).json(sucRes(cart, "Your Product Order Detail"))
        }
    } catch (err) {
        res.status(404).json(failRes(err.message, "Order Id Not Found"))
    }
}
async function showAllOrder(req, res){
   // try {
        let cart = await Cart.find({}) //belum berjalan
        console.log({customer: req.user})
        console.log(cart)
        res.status(200).json(sucRes(cart, "Your Chart Order"))
    // } catch (err) {
    //     res.status(404).json(failRes(err, "wrong"))
    // }
}

module.exports = {addToCart,  showOrder, showAllOrder}
