const User = require('../models/User')
const Product = require('../models/Product')
const {sucRes, failRes} = require('../helper/resFormat')
const multer = require('multer')
const Datauri = require('datauri');
const dUri = new Datauri();
const cloudinary = require('cloudinary').v2;

const fileFormat = (req, file, cb) => {
    if (file.mimetype === 'image/gif' || file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
        cb(null, true)
    } else {
        cb ("error: only can upload image (jpeg, png or gif)")
    }
}

var uploadImage = multer({fileFilter: fileFormat, limits: {fileSize: 1048576}}) // 1048576 kb = 1024 kb * 1024 kb * 1 = 1 mb

cloudinary.config({
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME
});
async function addScholarship(req, res){
    try {
        if (req.decoded.role != 'investor'){
            return res.status(403).json(funcHelpers.errorResponse('Access denied. Only for investor'))
        }

        let data_investor = await Investor.findOne({ id_user: req.decoded._id})
        if(data_investor===null){
            return res.status(404).json(funcHelpers.errorResponse('Profile investor not exist'))
        }

        await uploadImage.single('image')(req, res, (err)=>{
            if(err) return res.status(400).json(funcHelpers.errorResponse(err))
            User.findById(req.decoded._id, (err, user) =>{
                Scholarship.create(req.body, (err, scholarship) =>{
                    if (err) return res.status(422).json(funcHelpers.errorResponse(err))

                    scholarship.id_investor = user.id_investor
                    scholarship.id_user = user._id
                    scholarship.save()

                    Investor.findOne({id_user: req.decoded._id}, (err, investor)=>{
                        investor.list_id_sch.push(scholarship)
                        investor.save()

                        if (req.file == null){
                            return res.status(201).json(funcHelpers.successResponse(scholarship, "Add scholarship success"))
                        }
                        let file = dUri.format(`${req.file.originalname}-${Date.now()}`, req.file.buffer)
                        cloudinary.uploader.upload(file.content, {use_filename: true, folder: "belegend"}, (err, result) =>{
                            if (err) return res.status(400).json(funcHelpers.errorResponse(err))

                            scholarship.image = result.url
                            scholarship.save()

                            res.status(201).json(funcHelpers.successResponse(scholarship, "Add scholarship success"))
                        })
                    })
                })
            })
        })
    } catch (err) {  res.status(422).json(funcHelpers.errorResponse(err))  }}
async function addProduct(req, res){
    try {
        let user = await User.findById(req.user)
        if (user.role != 'merchant') {
            return res.status(403).json(failRes("Access denied. Only for merchant. If you will selling, please edit your profile change your role into merchant"))
        }
        await uploadImage.array('image', 2)(req, res, (err)=>{
            if(err) return res.status(400).json(failRes(err.message))
            Product.create(req.body, (err, product)=>{
                product.merchant = req.user //to insert user data into field merchant's product. not use push. push only can used if an array
                product.save()
            })
            
        })
       
        res.status(201).json(sucRes(product, "Add Product Success"))
    } catch (err) {
        res.status(422).json(failRes(err.message, "Wrong Type"))
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
