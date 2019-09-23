const jwt = require('jsonwebtoken')
const {sucRes, failRes} = require('../helper/resFormat')
const User = require('../models/User')

async function authLogin (req, res, next){
    let bearerToken = await req.headers.authorization
    if(!bearerToken) return res.status(401).json(failRes("Token Not Available"))
    let splitToken = bearerToken.split(" ") //only 2nd array will read
    try {
        let decoded = await jwt.verify(splitToken[1], 'r4h45145ek4l1')
        req.user = decoded._id
        let user = await User.findById(req.user)
        if(!user) return res.status(410).json(failRes("User Gone Due to Already Deleted"))
        next()
    } catch (err) {
        res.status(401).json(failRes("Invalid Token"))
    }
}

async function authProduct(req, res, next){
    let user = await User.findById(req.user)
    //console.log(user)
    if(user.role != 'merchant'){
        return res.status(400).json(failRes("Sorry, You are not merchant"))
    } else {
        next()
    }
}
module.exports = {authLogin, authProduct}
