const userRoutes = require('./user')
const articleRoutes = require('./article')
const router = require('express').Router();

router.use('/users', userRoutes)
router.use('/articles', articleRoutes)

module.exports = router