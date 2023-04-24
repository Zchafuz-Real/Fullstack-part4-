var _ = require('lodash')

const dummy = (blogs) => {
  return(1)
}

const totalLikes = (posts) => {
  const reducer = (sum, post) => {
    return sum + post.likes
  }

  return posts.reduce(reducer, 0)


}

const favoriteBlog = (blogs) => {
  let max = 0
  let bestBlog = {}
  blogs.forEach(blog => {
    if (blog.likes > max) {
      max = blog.likes
      bestBlog = blog
    }
  })

  return blogs.length === 0 ?
    0:
    { author:bestBlog.author,
      title:bestBlog.title, likes: bestBlog.likes }
}

const mostBlogs = (blogs) => {
  const mostBloged = _(blogs).countBy('author').entries().last()
  return { author: mostBloged[0], blogs: mostBloged[1] }
}

const mostLikes = (blogs) => {
    const mostLikes = _(blogs).groupBy('author').mapValues((blogs) => _.sumBy(blogs, 'likes')).entries().maxBy(1) 

    return {author: mostLikes[0], likes: mostLikes[1]}
}

module.exports = { dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs ,
  mostLikes}

