const mongoose = require('mongoose')
const moment = require('moment-timezone')

const orderSchema = new mongoose.Schema({
    orderDate: {
        type: Date,
        default: moment.tz(Date.now(), "Asia/Jakarta")
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cart'
    }],
    isDone: {
        type: Boolean,
        default: false
    },
    totalPrice: {
        type: Number,
        default: 0
    },
    totalWeight: {
        type: Number,
        default: 0
    }
})

const Order = mongoose.model('Order', orderSchema)

module.exports = Order
