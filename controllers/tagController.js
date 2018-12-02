/** server/controllers/article.ctrl.js*/

const Article = require('../models/Article')

module.exports = {
  getAll: (req, res, next) => {
    const query = Article.find({})
    query.select('tags')
    query.exec(function (err, data) {
      if (err) { 
        res.status(404).json({"error": "not found","err": err})
        return
      }
      res.status(200).send({ "message": "success", "data": data })
    })
  }
}
