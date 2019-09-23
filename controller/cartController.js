const Cart = require('../models/Cart')
const Order = require('../models/Order')
const User = require('../models/User')
const Product = require('../models/Product')
const {sucRes, failRes} = require('../helper/resFormat')

async function addToCart(req, res){
    try {
        let product = await Product.findById(req.params.id)
        if(product.merchant == req.user){ //customer can't order a product which stock less than qty order customer
            return res.status(403).json(failRes("You don't permission to buy yourself product"))
        } else if(product.stock < req.body.quantity){
            return res.status(400).json(failRes("Stock less than your order. Reduce your order"))
        }
        let cart = await Cart.create({quantity: req.body.quantity, product: req.params.id}) //fill quantity in req.body and id product in req.params
        //let product = await Product.findById(req.params.id) //this function not use because already insert in let cart. made simple code
        cart.customer = req.user
        let subtotal = (req.body.quantity * product.price)
        cart.subTotal = subtotal
        let subweight = (req.body.quantity * product.weight)
        cart.subWeight = subweight
        cart.save()


        let stock = (product.stock - req.body.quantity) //stock product will reduce automatically if customer add to cart
        product.stock = stock
        product.save()

        let order = await Order.findOne({customer: req.user, isDone: false}).populate('products')
        order.products.push(cart)
        order.totalPrice += subtotal
        order.totalWeight += subweight
        order.save()

        res.status(200).json(sucRes(order, "Success Add To Cart"))
    } catch (err) {
        res.status(404).json(failRes(err, "product not found"))
    }
}

async function showOneCart(req, res){ //showing one cart's user
    //let user = await User.findById(req.user) //unnecessary. can implement req.user directly in function 
    try {
        let cart = await Cart.findById(req.params.id).populate('product')
        if (cart.customer != req.user){
            return res.status(403).json(failRes("Access Denied. This isn't Your Cart"))
        } else {
            res.status(200).json(sucRes(cart, "Your a Cart Order Detail"))
        }
    } catch (err) {
        res.status(404).json(failRes(err.message, "Order Id Not Found"))
    }
}
async function showAllCart(req, res){ //showing all cart's user active
    let cart = await Cart.find({customer: req.user}).populate('product') //menampilkan semua cart, baik itu punya sendiri maupun orang lain
    res.status(200).json(sucRes(cart, "Your Chart Order"))
}

module.exports = {addToCart,  showOneCart, showAllCart}
