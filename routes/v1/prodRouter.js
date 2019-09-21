const router = require('express').Router()
const prodController = require('../../controller/prodController')
const auth = require('../../middleware/auth')

router.post('/create', [auth.authLogin, auth.authProduct], prodController.addProduct)
router.put('/update', [auth.authLogin, auth.authProduct], prodController.updateProduct)
router.get('/show/:id', prodController.showOne)
router.get('/index', prodController.showAll)
router.get('/show', prodController.showByCategory)

module.exports = router
