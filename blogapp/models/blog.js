const mongoose = require('mongoose')



const blogSchema = new mongoose.Schema({
  title: String,
  author: {
    type: String,
    required: true
  },
  url: String,
  likes: Number
})



module.exports = mongoose.model('Blog', blogSchema)