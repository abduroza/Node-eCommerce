const User = require('../models/User')
const Product = require('../models/Product')
const {sucRes, failRes} = require('../helper/resFormat')

async function addProduct(req, res){
    try {
        let product = await Product.create(req.body)
        product.merchant = req.user //to insert user data into field merchant's product. not use push. push only can used if an array
        product.save()
       
        res.status(201).json(sucRes(product, "Add Product Success"))
    } catch (err) {
        if (err) res.status(422).json(failRes(err.message, "Wrong Type"))
    }
}
async function updateProduct(req, res){
    try {
        let product = await Product.findById(req.params.id)
        if (product.merchant != req.user) {
            return res.status(403).json(failRes("Access denied. This isn't your product"))
        }
        try {
            let data = await Product.findByIdAndUpdate(req.params.id, {$set: req.body})
            res.status(200).json(sucRes(data, "Product Update Success"))
        } catch (err) {
            res.status(400).json(failRes(err.message, "Wrong Type"))
        }
    } catch (err) {
        res.status(404).json(failRes(err.message, "ID Product Not Found"))
    }
}
async function showMerchantProduct(req, res){
    let product = await Product.find({merchant: req.user}).populate({path: 'merchant', select: ['_id', 'username']})
    res.status(200).json(sucRes(product, "Your Products"))
}
async function showOne(req, res){
    try {
        let product = await Product.findById(req.params.id)
            .select(['_id', 'name', 'category', 'price', 'stock', 'description', 'condition', 'weight', 'merchant'])
            .populate({path: 'merchant', select: ['_id', 'username']})
        //if (product.merchant._id != req.user) return res.status(400).json(failRes("This isn't Your Product"))
        res.status(200).json(sucRes(product, "Show a Product Success"))
    } catch (err) {
        res.status(404).json(failRes(err.message, "ID not found"))
    }
}
async function showAll(req, res){//show all product
    let product = await Product.find({})
    res.status(200).json(sucRes(product, "Show All Product"))
}
async function showCategory(req, res){ //showing product by category
    let product = await Product.find({category: new RegExp(req.body.category, 'i')})
    res.status(200).json(sucRes(product, "Show by Category"))
}
async function showName(req, res){ //showing product by name
    //RegExp useful to ignore lowercase, uppercase and specific name. $gte useful to filter name product which have stock >= 1
    let product = await Product.find({name: new RegExp(req.body.name, 'i'), stock: {$gte: 1} }) //regexp useful to ignore lowercase, uppercase and specific name. this function will show name of product which contain as filled user in form
    res.status(200).json(sucRes(product, "Show by Name"))
}

module.exports = {addProduct, showMerchantProduct, updateProduct, showOne, showAll, showCategory, showName}
