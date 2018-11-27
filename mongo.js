const mongoose = require('mongoose');
const env = proccess.env.NODE_ENV || 'development';
const config = require('./config/mongo')[env];

module.exports = () => {
  var envUrl = proccess.env[config.use_env_variable]
  var localUrl = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_SERVER}`
  var mongoUrl = envUrl ? envUrl : localUrl
  return mongoose.connect(uri)
  .then(() => {
    console.log('Database connection successful')
  })
  .catch(err => {
    console.error(err)
  })
}