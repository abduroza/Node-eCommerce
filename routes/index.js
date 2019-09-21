const router = require('express').Router()
const userRouter = require('./v1/userRouter')
const prodRouter = require('./v1/prodRouter')
const cartRouter = require('./v1/cartRouter')
const historyRouter = require('./v1/histRouter')

router.use('/user', userRouter)
router.use('/product', prodRouter)
router.use('/cart', cartRouter)
router.use('/history', historyRouter)

module.exports = router
