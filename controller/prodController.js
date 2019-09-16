const User = require('../models/User')
const Product = require('../models/Product')
const {sucRes, failRes} = require('../helper/resFormat')

async function addProduct(req, res){
    try {
        let user = await User.findById(req.user)
        let product = await Product.create(req.body)

        user.products.push(product) //to insert product into field products's user
        user.save()
        product.user.push(user) //to insert user data into field user's product. push only can used if an array
        product.save()
       
        res.status(201).json(sucRes(product, "Add Product Success"))
    } catch (err) {
        if (err) res.status(422).json(failRes(err.message, "Wrong Type"))
    }
}
async function showProduct(req, res){
    try {
        let product = await Product.findById(req.params.id)
            .select(['_id', 'name', 'category', 'price', 'stock', 'description', 'condition', 'weight', 'date', 'user'])
            .populate({path: 'user', select: ['_id', 'username', 'email', 'date', 'role', 'products']})
        if (product.user[0]._id != req.user) return res.status(400).json(failRes("This isn't Your Product"))
        res.status(200).json(sucRes(product, "Show a Product Success"))
    } catch (err) {
        if(err) res.status(400).json(failRes(err.message, "ID not found"))
    }
}

module.exports = {addProduct, showProduct}
