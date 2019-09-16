const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: [80, 'too length, max 80 characters'],
        minlength: [5, 'too short, min 5 character']
    },
    category: {
        type: String,
        enum: ['food', 'handphone', 'electronic']
    },
    price: {
        type: Number,
        required: true
    },
    stock: {
        type:Number,
        default: 1
    },
    description: {
        type: String,
        maxlength: [3000, 'too length, max 3000 characters'],
        minlength: [10, 'too short, min 10 characters']
    },
    condition: {
        type: Boolean,
        default: true
    },
    weight: {
        type: Number
    },
    date: {
        type: Date,
        default: Date.now
    },
    user: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
})
const Product = mongoose.model('Product', productSchema)
module.exports = Product
