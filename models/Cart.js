const mongoose = require('mongoose')
const timeZone = require('mongoose-timezone')

const cartSchema = new mongoose.Schema({
    toCartDate: {
        type: Date,
        default: Date.now
    },
    quantity: {
        type: Number,
        default: 1
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }]
    // products: [{
    //     product: {type: mongoose.Schema.Types.ObjectId, ref: 'Product'},
    //     quantity: {type: Number, default: 1},
    //     price: {type: Number, default: 0},
    //     weight: {type: Number, default: 0}
    // }]
})

const Cart = mongoose.model('Cart', cartSchema)
cartSchema.plugin(timeZone)

module.exports = Cart
