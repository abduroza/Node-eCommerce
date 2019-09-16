const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: [80, 'too length, max 80 characters'],
        minlength: [5, 'too short, min 5 character']
    },
})