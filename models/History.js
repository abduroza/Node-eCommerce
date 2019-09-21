const mongoose = require('mongoose')
const moment = require('moment-timezone')

const historySchema = new mongoose.Schema({
    toCartDate: {
        type: Date,
        default: moment.tz(Date.now(), "Asia/Jakarta")
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
})

const History = mongoose.model('History', historySchema)

module.exports = History
