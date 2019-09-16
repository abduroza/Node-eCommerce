const router = require('express').Router()
const userRouter = require('./v1/userRouter')
const prodRouter = require('./v1/prodRouter')

router.use('/user', userRouter)
router.use('/product', prodRouter)

module.exports = router
