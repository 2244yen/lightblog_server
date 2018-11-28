const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const errorHandler = require('errorhandler')
const mongoose = require('mongoose')
const cloudinary = require('cloudinary')
const helmet = require('helmet')
const app = express()
const apiRoutes = require('./routes/api')
// const isProduction = process.env.NODE_ENV === 'production'

app.set('port', (process.env.PORT || 8000));
app.use(cors())
app.use(require('morgan')('dev'))
app.use(bodyParser.json())
app.use(helmet())
app.use(express.static(path.join(__dirname, 'public')))

if(app.get('env') === 'development') {
  app.use(errorHandler())
  require('dotenv').config()
}

// Cloudinary
cloudinary.config({
  cloud_name: 'linhdang92',
  api_key: '345152519641648',
  api_secret: 'wNs3ds_VyyF0otZRPHjA5kA5r5I'
})

// Connect mongoDB
mongoose.set('debug', true)
mongoose.Promise = global.Promise
// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_SERVER}`
// const serverOptions = {
//   useNewUrlParser: true,
//   useCreateIndex: true,
//   keepAlive: true,
//   reconnectTries: Number.MAX_VALUE,
//   bufferMaxEntries: 0
// }

// mongoose.connect(uri, serverOptions)
// .then(() => {
//   console.log('Database connection successful')
// })
// .catch(err => {
//   console.error(err)
// })
app.use((req, res, next) => {
  console.log('res')
  if (mongoose.connection.readyState) {
    console.log('ready')
    next()
  } else {
    console.log("else (mongoose.connection.readyState)");
    require("./mongo")().then(() => next());
    console.log("else (mongoose.connection.readyState)");
  }
})
// Add routes
app.get('/', (req, res, next) => {
  res.send('home')
})
// app.use('/user', userRouter)
// app.use('/article', articleRouter)
app.use('/api', apiRoutes)

app.use((req, res, next) => {
  const err = new Error('Not Found')
  err.status = 404;
  next(err)
})

if (!isProduction) {
  app.use((err, req, res) => {
    res.status(err.status || 500)

    res.json({
      errors: {
        message: err.message,
        error: err,
      }
    })
  })
}

app.use((err, req, res) => {
  res.status(err.status || 500)

  res.json({
    errors: {
      message: err.message,
      error: {},
    }
  })
})

// const server = app.listen(8000, () => console.log('Server started on http://localhost:8000'))
// server.timeout = 1000

module.exports = app