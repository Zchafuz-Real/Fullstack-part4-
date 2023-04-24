const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

describe('api tests', () => {
    const initialBlogs = [
        {
            _id: '5a422a851b54a676234d17f7',
            title: 'React patterns',
            author: 'Michael Chan',
            url: 'https://reactpatterns.com/',
            likes: 7,
            __v: 0
        },
        {
            _id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
            likes: 5,
            __v: 0
        },
        {
            _id: '5a422b3a1b54a676234d17f9',
            title: 'Canonical string reduction',
            author: 'Edsger W. Dijkstra',
            url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
            likes: 12,
            __v: 0
        }
    ]
    
    beforeEach(async () => {
    
        await Blog.deleteMany({})
        let blogObjects = initialBlogs.map(blog => new Blog(blog))
        
        const promiseArray = blogObjects.map(blog => blog.save())
    
        await Promise.all(promiseArray)
    
    })
    
    test('blogs are returned as json', async () => {
        await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })
    
    test('the correct amount of blogs is returned', async () => {
        const response = await api.get('/api/blogs')
    
        expect(response.body).toHaveLength(initialBlogs.length)
    })
    
    test('check the titles of the blogs', async () => {
        const response = await api.get('/api/blogs')
    
        const title = response.body[0].title
    
        expect(title).toContain(initialBlogs[0].title)
    
    })
    
    test('adding a new blog', async () => {
        const newBlog = {
            title: 'testing refactored backend',
            author: 'tester',
            url: 'testurl.com',
            like: 1000
        }
    
        await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    
        const response = await api.get('/api/blogs')
        const titles = response.body.map(blog => blog.title)
    
        expect(response.body).toHaveLength(initialBlogs.length + 1)
        expect(titles).toContain('testing refactored backend')
    })
    
    test('adding a blog without author', async () => {
    
        const newBlog = {
            title: 'not author',
            url: 'test.com',
            like: 100
        }
    
        await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
            
    })
    
    test('checking the existance of id parameter', async () => {
    
        const response = await api.get('/api/blogs')
        const id = response.body.id
    
        expect(id).toBeDefined()
    })
    
    afterAll(async() => {
        await mongoose.connection.close()
    })
    
})


