const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')

router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())

const User = require('../models/User')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const config = require('../config')
const verifyToken = require('../verifyToken')

router.post('/register', function (req, res) {
  const { body } = req
  const hashPass = bcrypt.hashSync(body.password, 8)
  User.create({
    username: body.username,
    email: body.email,
    password: hashPass
  }, function (err, user) {
    if (err) return res.status(500).send("There was a problem registering the user.")
    // create token
    const token = jwt.sign({
      id: user._id
    }, config.secret, { expiresIn: 86400 })
    res.status(200).send({ auth: true, token: token })
  })
})

// use middleware verifyToken to check login
router.get('/me', verifyToken, function (req, res) {
  User.findById(req.userId, { password: 0 } , function (err, user) {
    if (err) return res.status(500).send('Failed')
    res.status(200).send({ message: 'success', data: user })
  })
})

router.post('/login', function (req, res) {
  const { body } = req
  User.findOne({ email: body.email }, function (err, user) {
    if (err) return res.status(500).send('Error on the server.')
    if (!user) return res.status(404).send('No user found.')
    // compare password
    const passwordIsValid = bcrypt.compareSync(body.password, user.password)
    if (!passwordIsValid) return res.status(401).send({ auth: false, token: null })
    const token = jwt.sign({
      id: user._id
    }, config.secret, { expiresIn: 86400 })
    res.status(200).send({ auth: true, token: token })
  })
})

router.get('/logout', function (req, res) {
  res.status(200).send({ auth: false, token: null })
})

module.exports = router