const router = require('express').Router()
const historyController = require('../../controller/histController')
const auth = require('../../middleware/auth')

router.post('/add/:id', [auth.authLogin], historyController.addToHistory)
router.get('/index', [auth.authLogin], historyController.orderHistory)

module.exports = router