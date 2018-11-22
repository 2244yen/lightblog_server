const mongoose = require('mongoose')

const ArticleSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  url: {
    type: String,
    unique: true
  },
  description: String,
  text: String,
  tags: Array,
  thumbnail: String,
  author: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User'
  },
  likes: {
    type: Number,
    default: 0
  },
  comments: [
    {
      author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      text: String
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { collection: 'articles' })

ArticleSchema.methods.getUserArticle = function (_id) {
  Article.find({'author': _id}).then(article => {
    return article
  })
}

ArticleSchema.methods.addAuthor = function (author_id) {
  this.author = author_id
  return this.save()
}

ArticleSchema.methods.comment = function (c) {
  this.comments.push(c)
  return this.save()
}

module.exports = mongoose.model('Article', ArticleSchema)
