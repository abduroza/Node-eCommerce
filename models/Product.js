const mongoose = require('mongoose')
const timeZone = require('mongoose-timezone')

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'name must be filled'],
        maxlength: [80, 'too length, max 80 characters'],
        minlength: [3, 'too short, min 3 character']
    },
    category: {
        type: String
    },
    price: {
        type: Number,
        required: [true, 'price must be filled in IDR. example: 150000']
    },
    stock: {
        type: Number,
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
        type: Number,
        required: [true, 'Weight must filled. Weight in gram']
    },
    productDate: {
        type: Date,
        default: Date.now
    },
    merchant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})
const Product = mongoose.model('Product', productSchema)
productSchema.plugin(timeZone)

module.exports = Product
