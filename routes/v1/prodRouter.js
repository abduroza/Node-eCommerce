const router = require('express').Router()
const prodController = require('../../controller/prodController')
const auth = require('../../middleware/auth')

router.post('/create', [auth.authLogin, auth.authProduct], prodController.addProduct)
router.put('/update/:id', [auth.authLogin, auth.authProduct], prodController.updateProduct)
router.get('/show', [auth.authLogin], prodController.showMerchantProduct)
router.get('/show/:id', prodController.showOne)
router.get('/index', prodController.showAll)
router.get('/showcategory', prodController.showCategory)
router.get('/showname', prodController.showName)

module.exports = router
