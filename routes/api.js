const userRoutes = require('./user')
const articleRoutes = require('./article')
const tagRoutes = require('./tag')
const router = require('express').Router();

router.use('/users', userRoutes)
router.use('/articles', articleRoutes)
router.use('/tags', tagRoutes)
module.exports = router