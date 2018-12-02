const router = require('express').Router();
const tagCtrl = require('../controllers/tagController')

// get tags
router.get('/', tagCtrl.getAll)

module.exports = router