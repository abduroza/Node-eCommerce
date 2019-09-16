const jwt = require('jsonwebtoken')
const {sucRes, failRes} = require('../helper/resFormat')
const User = require('../models/User')

async function auth(req, res, next){
    let bearerToken = await req.headers.authorization
    if(!bearerToken) return res.status(401).json(failRes("Token Not Available"))
    let splitToken = bearerToken.split(" ") //only 2nd array will read
    try {
        let decoded = await jwt.verify(splitToken[1], 'r4h45145ek4l1')
        req.user = decoded._id
        let data = await User.findById(req.user)
        if(!data) return res.status(404).json(failRes("User Not Found"))
        next()
    } catch (err) {
        res.status(400).json(failRes("Invalid Token"))
    }
}

module.exports = auth
