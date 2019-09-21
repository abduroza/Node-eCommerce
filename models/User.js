const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const timeZone = require('mongoose-timezone')

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: [true, 'first name must be filled']
    },
    lastname: {
        type: String,
        required: [true, 'last name must be filled']
    },
    username: {
        type: String,
        required: [true, 'username must be filled'],
        unique: [true, 'username already exist, must be unique'],
        minlength: [3, 'too short, min 3 character'],
        validate: function(username){
            return /^\S*$/.test(username) //using regular expression
        }
    },
    email: {
        type: String,
        required: [true, 'email must be filled'],
        unique: [true, 'email already exist, must be unique'],
        validate: function validateEmail(email) {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(String(email).toLowerCase());
        }
    },
    password: {
        type: String,
        required: true,
        minlength: [5, 'too short, min 5 character']
    },
    role: {
        type: String,
        enum: ['merchant', 'customer'],
        default: 'customer'
    },
    registerDate: {
        type: Date,
        default: Date.now
    },
    histories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'History'
    }],
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }],
    carts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cart'
    }],
})

const User = mongoose.model('User', userSchema)
userSchema.plugin(uniqueValidator)
userSchema.plugin(timeZone)

module.exports = User
