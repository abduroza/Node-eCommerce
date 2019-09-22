const router = require('express').Router()
const userRouter = require('./v1/userRouter')
const prodRouter = require('./v1/prodRouter')
const cartRouter = require('./v1/cartRouter')
const orderRouter = require('./v1/orderRouter')

router.use('/user', userRouter)
router.use('/product', prodRouter)
router.use('/cart', cartRouter)
router.use('/order', orderRouter)

module.exports = router
