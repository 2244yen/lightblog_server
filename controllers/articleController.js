/** server/controllers/article.ctrl.js*/

const Article = require('../models/Article')
const User = require('../models/User')
const fs = require('fs')
const cloudinary = require('cloudinary')

module.exports = {
  create: (req, res, next) => {
    let { body } = req
    body.tags = JSON.parse(body.tags)
    if (req.files.thumbnail) {
      cloudinary.uploader.upload(req.files.thumbnail.path, (result) => {
        body.thumbnail = result.url || ''
        saveArticle(body)
      },{
        resource_type: 'image'
      })
    } else {
      saveArticle(body) 
    }
    function saveArticle (obj) {
      new Article(obj).save((err, article) => {
        if (err)
          return res.status(500).send({ "message": err })
        return res.status(201).send({ "message": "success", "data": article })
      })
    }
  },
  getAll: (req, res, next) => {
    let { query } = req
    let data = {}
    const queryData = Article.find()
    if (query.isFeatured) {
      queryData.where('likes').equals(0)
    }
    if (query.search) {
      queryData.or[{ title: query.search }, { description: query.search }]
    }
    queryData.limit(10).sort({ createdAt: -1 })
    queryData.exec(function (err, data) {
      if (err) { 
        res.status(404).json({"error": "not found","err": err})
        return
      }
      res.status(200).send({ "message": "success", "data": data })
    })
  },
  getTags: (req, res, next) => {
    const query = Article.find()
    query.exec(function (err, data) {
      console.log('tags', err)
      if (err) { 
        res.status(404).json({"error": "not found","err": err})
        return
      }
      res.status(200).send({ "message": "success", "data": data })
    })
  },
  getDetail: (req, res, next) => {
    Article.findOne({ url: req.params.id }).then(response => {
      res.status(200).send({ "message": "success", "data": response })
    }).catch(err => {
      res.status(500).send({ "message": "fail", "err": err })
    })
  },
  delete: (req, res, next) => {
    Article.findByIdAndDelete({ _id: req.params.id })
    .then(response => {
      res.status(200).send({ "message": "success" })
      next()
    })
    .catch(err => {
      res.status(500).send({ "message": "fail", "err": err })
    })
  },
  update: (req, res, next) => {
    Article.findOne({ _id: req.params.id }, function (err, _article) {
      if (!err) {
        if (!_article) {
          res.status(404).send({ "message": "fail", "err": "Not Found" })
        }
        Article.updateOne({}, function (err, response) {
          if (err) {
            res.status(500).send({ "message": "fail", "err": err })
          }
          res.status(200).send({ "message": "success", "data": "Update data successfully!" })
        })
      }
    })
  }
}