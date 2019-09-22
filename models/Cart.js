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
    product: { // not use array due to only one by one product which enter into Cart
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    },
    subTotal: {
        type: Number,
        default: 0
    },
    subWeight: {
        type: Number,
        default: 0
    }
})

const Cart = mongoose.model('Cart', cartSchema)
cartSchema.plugin(timeZone)

module.exports = Cart
