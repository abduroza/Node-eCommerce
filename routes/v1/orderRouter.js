const router = require('express').Router()
const orderController = require('../../controller/orderController')
const auth = require('../../middleware/auth')

router.put('/checkout', [auth.authLogin], orderController.checkout)
router.get('/index', [auth.authLogin], orderController.orderHistory)

module.exports = router
