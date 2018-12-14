const mongoose = require('mongoose');
const env = process.env.NODE_ENV || 'development';
const config = require('./config/mongo')[env];

module.exports = () => {
  var envUrl = process.env[config.use_env_variable]
  var localUrl = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@ds117834.mlab.com:17834/lightblog`
  var mongoUrl = envUrl ? envUrl : localUrl
  const serverOptions = {
    useNewUrlParser: true,
    useCreateIndex: true,
    keepAlive: true,
    reconnectTries: Number.MAX_VALUE,
    bufferMaxEntries: 0
  }
  console.log(mongoUrl)
  return mongoose.connect(mongoUrl, serverOptions)
  .then(() => {
    console.log('Database connection successful')
  })
  .catch(err => {
    console.error(err)
  })
}