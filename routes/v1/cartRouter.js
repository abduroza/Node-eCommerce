const router = require('express').Router()
const cartController = require('../../controller/cartController')
const auth = require('../../middleware/auth')

router.post('/add/:id', [auth.authLogin], cartController.addToCart)
router.get('/show/:id', [auth.authLogin], cartController.showOneCart)
router.get('/index', [auth.authLogin], cartController.showAllCart)


module.exports = router
