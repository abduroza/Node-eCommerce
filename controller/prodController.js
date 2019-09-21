const User = require('../models/User')
const Product = require('../models/Product')
const {sucRes, failRes} = require('../helper/resFormat')

async function addProduct(req, res){
    try {
        let user = await User.findById(req.user)
        let product = await Product.create(req.body)

        user.products.push(product) //to insert product into field products's user
        user.save()
        product.merchant.push(user) //to insert user data into field merchant's product. push only can used if an array
        product.save()
       
        res.status(201).json(sucRes(product, "Add Product Success"))
    } catch (err) {
        if (err) res.status(422).json(failRes(err.message, "Wrong Type"))
    }
}
async function updateProduct(req, res){
    try {
        let product = await Product.findById(req.params.id)
        if (product.user[0]._id != req.user){
            return res.status(400).json(failRes("Acces denied. This isn't your product"))
        } else {
            let data = await Product.findByIdAndUpdate(req.params.id, {$set: req.body})
            res.status(200).json(sucRes(data, "Product Update Success"))
            res.status(400).json(failRes("Wrong Type"))
        }
    } catch (err) {
        res.status(404).json(failRes(err, "ID Not Found"))
    }
}
async function showOne(req, res){
    try {
        let product = await Product.findById(req.params.id)
            .select(['_id', 'name', 'category', 'price', 'stock', 'description', 'condition', 'weight', 'merchant'])
            .populate({path: 'merchant', select: ['_id', 'username']})
        //if (product.merchant._id != req.user) return res.status(400).json(failRes("This isn't Your Product"))
        res.status(200).json(sucRes(product, "Show a Product Success"))
    } catch (err) {
        res.status(400).json(failRes(err.message, "ID not found"))
    }
}
async function showAll(req, res){
    let product = await Product.find({})
    res.status(200).json(sucRes(product, "Show All Product"))
}
async function showByCategory(req, res){
    try {
        let product = await Product.find({category: req.body.category})
        res.status(200).json(sucRes(product, "Show by Category"))
    } catch (err) {
        res.status(404).json(failRes(err, "Category Not Found"))
        
    }
}
module.exports = {addProduct, updateProduct, showOne, showAll, showByCategory}
