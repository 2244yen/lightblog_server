const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    unique: [true, 'Username này đã tồn tại trong hệ thống!'],
    required: [true, 'Username không được để trống!']
  },
  email: {
    type: String,
    unique: [true, 'Email này đã tồn tại trong hệ thống!']
  },
  name: String,
  biography: String,
  picture: String,
  created: { 
    type: Date,
    default: Date.now
  }
}, { collection: 'users' })

module.exports = mongoose.model('User', UserSchema)