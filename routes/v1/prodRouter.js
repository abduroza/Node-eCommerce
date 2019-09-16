const router = require('express').Router()
const prodController = require('../../controller/prodController')
const auth = require('../../middleware/auth')

router.post('/create', auth, prodController.addProduct)
router.get('/show/:id', auth, prodController.showProduct)

module.exports = router
