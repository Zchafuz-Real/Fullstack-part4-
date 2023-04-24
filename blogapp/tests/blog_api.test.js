const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

const initialBlogs = [
    {
        title: 'testBlog 1',
        author: 'me',
        url: '123www..dfa',
        likes: 10 
    }
]

beforeEach(async () => {

    await Blog.deleteMany({})
    let blogObject = new Blog(initialBlogs[0])
    await blogObject.save()

})

test('blogs are returned as json', async () => {
    await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('check the contents of the blogs', async () => {
    const response = await api.get('/api/blogs')

    const title = response.body[0].title

    expect(title).toContain('testBlog 1')

})


afterAll(async() => {
    await mongoose.connection.close()
})

