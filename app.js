const mongoose = require('mongoose')
const express = require('express')
const app = express()

const env = process.env.NODE_ENV
if (env == 'development' || env == 'test'){
    require('dotenv').config()
}

const configDB = {
    development: process.env.DBDEV, //mongodb://localhost/ecommerce
    test: process.env.DBTEST, //must insert DBTEST as key and connection string from CloudMongodB as value in setting CI/CD gitlab
    production: process.env.DBPROD //to run in online server
}

mongoose.connect(configDB[env], {useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false, useUnifiedTopology: true})
.then(() => console.log("Connect DB"))

const morgan = require('morgan')
app.use(morgan('dev')) //to show log in console
const cors = require('cors') 
app.use(cors()) // to connect with frontend. if not given can't read by frontend
app.use(express.json()) //to get req.body as changer bodyparser
app.use(express.urlencoded({extended: false})) //to get req.body. So in postman can use Body x-www-form-erlencoded.

//using route-level middleware
const router = require('./routes/index')
app.use('/api', router)

app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        messages: "Welcome to eCommerce API"
    })
})

//perform error message if wrong type of endpoint/route
app.use((req, res) => {
    res.status(404).json({URL: req.originalUrl + "  Not Found. Enter URL Correctly"})
})

//turn on the server
const port = process.env.PORT 
app.listen(port, () =>{
    console.log(`Server Started at ${Date()}`)
    console.log(`Listening on Port: ${port} in environment: ${env}`)
})

module.exports = app //used to integration testing
