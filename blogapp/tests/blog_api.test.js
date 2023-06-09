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
        },
        {

            title: 'no likes property',
            author: 'not very liked',
            url: 'badblog.com',
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
        const id = response.body[0].id
        
        expect(id).toBeDefined()
    })
    
    test('to check the default value of the id parameter', async () => {

        const response = await api.get('/api/blogs')
        const no_like = response.body.find(blog => 
            blog.title === 'no likes property')

        expect(no_like).toBeDefined()    
        expect(no_like).toHaveProperty( 'likes', 0 )
    })

    test('check if proper error when no title', async () => {

        const newBlog = {
            author: 'forgot the title',
            url: 'notitle.com',
            likes: 1        
        }

        await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)

    })

    test('check if proper error when no url', async () => {

        const newBlog = {
            title: 'forgot the url',
            author: 'urlforgotter',
            likes: 2
        }

        await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)

    })

    test('fails if unable to delete a note', async () => {

        await api
        .delete(`/api/blogs/${initialBlogs[0]._id}`)
        .expect(204)

        response = await api.get('/api/blogs')
        expect(response.body[0].title).toBe(initialBlogs[1].title)
        expect(response.body).toHaveLength(initialBlogs.length - 1)

    })

    test('fails if unable to update a note', async () => {

        const id = initialBlogs[0]._id

        const newBlog = {
            ...initialBlogs[0],
            likes: 29
        }
        
        await api
        .put(`/api/blogs/${id}`)
        .send(newBlog)
        .expect(200)

        const editedBlog = await api.get(`/api/blogs/${id}`)
        expect(editedBlog.body.likes).toBe(29)
    })

    afterAll(async() => {
        await mongoose.connection.close()
    })
    
})


