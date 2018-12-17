const User = require('../models/User')

module.exports = {
  addUser: (req, res, next) => {
    const user = new User(req.body)
    user.save()
    .then(_user => {
      res.status(200).send({ "message": "success", "data": _user })
      next()
    })
    .catch(err => {
      res.send(500, err)
    })
  },
  getAll: (req, res, next) => {
    User.find({}, function(err, _users) {
      if (err) {
        res.status(404).send({ "error": "not found", "err": err })
      }
      res.status(200).send({ "message": "success", "data": _users })
      next()
    })
  },
  getDetail: (req, res, next) => {
    User.findById(req.params.id, function(err, _user) {
      if (err) {
        res.status(500).send({ "message": "fail", "err": err })
      } else if (!_user) {
        res.status(404).send({ "message": "not found", "err": err })
      } else {
        res.status(200).send({ "message": "success", "data": _user })
      }
      next()
    })
  },
  getDetailByEmail: (req, res, next) => {
    User.findOne({ email : req.params.email }, function(err, _user) {
      if (err) {
        res.status(500).send({ "message": "fail", "err": err })
      } else if (!_user) {
        res.status(200).send({ "message": "not found", "err": err })
      } else {
        res.status(200).send({ "message": "success", "data": _user })
      }
      next()
    })
  },
  delete: (req, res) => {
    User.findByIdAndDelete({ _id: req.params.id })
    .then(response => {
      res.status(200).send({ "message": "success" })
      next()
    })
    .catch(err => {
      res.status(500).send({ "message": "fail", "err": err })
    })
  },
  getProfile: (req, res) => {
    console.log(req)
  }
}