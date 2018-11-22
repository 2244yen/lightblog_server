const router = require('express').Router();
const articleCtrl = require('../controllers/articleController')
const multipart = require('connect-multiparty')
const multipartWare = multipart()

// get articles
router.get('/', articleCtrl.getAll)

// Add article
// router.post('/create', multipartWare, articleCtrl.create)
router
  .route('/create')
  .post(multipartWare, articleCtrl.create)

// get 1 article
router.get('/:id', articleCtrl.getDetail)

// Delete article
router.delete('/:id/delete', articleCtrl.delete)

// Update article
router.put('/:id/update', articleCtrl.update)

module.exports = router