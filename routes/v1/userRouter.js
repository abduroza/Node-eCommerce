const router = require('express').Router()
const userController = require('../../controller/userController')
const auth = require('../../middleware/auth')

router.post('/register', userController.register)
router.post('/login/', userController.login)
router.get('/show', auth, userController.show)

module.exports = router
