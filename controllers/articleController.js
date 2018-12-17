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
        const linkImg = result.url.replace('http://res.cloudinary.com/linhdang92/image/upload', '')
        body.thumbnail = 'http://res.cloudinary.com/linhdang92/image/upload/c_fill,h_350,w_690' + linkImg
        saveArticle(body)
      },{
        resource_type: 'image'
      })
    } else {
      saveArticle(body)
    }
    
    function saveArticle (obj) {
      const promise = new Article(obj).save()
      promise.then(article => {
        res.status(200).send({ "message": "success" })
      }).catch(err => {
        return next(err)
      })
    }
  },
  getAll: (req, res, next) => {
    let { query } = req
    let data = {}
    const queryData = Article.find()
    queryData.populate('author')
    if (query.isFeatured) {
      queryData.where('likes').gt(0)
    }
    if (query.search) {
      queryData.or([{ "title": { $regex: '.*' + query.search + '.*' } }, { "description": { $regex: '.*' + query.search + '.*' } }])
    }
    if (query.tags) {
      queryData.where({ "tags": { $elemMatch: { $eq: query.tags }}})
    }
    const page = query.page || 1
    const limit = query.limit || 10
    queryData.limit(limit)
    queryData.skip(page > 0 ? (page - 1) * limit : 0)
    queryData.sort({ createdAt: -1 })
    queryData.exec(function (err, data) {
      if (err) return next(err)
      if (!data) return next(new Error('No article found.'))
      const countQuery = Article.find()
      if (query.search) {
        countQuery.or([{ "title": { $regex: '.*' + query.search + '.*' } },{ "description": { $regex: '.*' + query.search + '.*' } }])
      }
      if (query.tags) {
        countQuery.where({ "tags": { $elemMatch: { $eq: query.tags }}})
      }
      countQuery.countDocuments(function(err, count) {
        res.status(200).send({ "message": "success", "data": data, "total": count })
      })
    })
  },
  getDetail: (req, res, next) => {
    Article.findOne({ url: req.params.id })
    .populate('author')
    .exec(function (err, data) {
      if (err) return res.status(500).send({ "message": "fail", "err": err })
      res.status(200).send({ "message": "success", "data": data }) 
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
  },
  clap: (req, res, next) => {
    Article.findOne({ url: req.params.id }).then(response => {
      response.clap().then(() => {
        return res.json({ "message": "Done!" })
      })
    }).catch(err => {
      res.status(500).send({ "message": "fail", "err": err })
    })
  },
  getRelated: (req, res, next) => {
    const { query, params } = req
    Article.findOne({ url: params.id }, function(err, data) {
      if (err) return next(err)
      const relatedQuery = Article.find()
      relatedQuery.where({ "_id": { $nin: [data._id] }})
      relatedQuery.and([{ "tags": { $all: data.tags }}, { "author": data.author._id }])
      relatedQuery.sort({ createdAt: -1 })
      relatedQuery.limit(3)
      relatedQuery.exec(function (err, response) {
        if (err) return res.status(500).send({ "message": "fail", "err": err })
        res.status(200).send({ "message": "success", "data": response })
      })
    })
  }
}