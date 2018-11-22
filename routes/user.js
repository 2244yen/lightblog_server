const router = require('express').Router()
const userCtrl = require('../controllers/userController')

router.get('/', userCtrl.getAll)

router.post('/create', userCtrl.addUser)

router.get('/:id', userCtrl.getDetail)

router.get('/email/:email', userCtrl.getDetailByEmail)

router.delete('/:id/delete', userCtrl.delete)

module.exports = router