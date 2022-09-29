const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')

const api = supertest(app)
const Blog = require('../models/blog')


// const initialBlogs = [
//   {
//     _id: "5a422a851b54a676234d17f7",
//     title: "React patterns",
//     author: "Michael Chan",
//     url: "https://reactpatterns.com/",
//     likes: 7,
//     __v: 0
//   },
//   {
//     _id: "5a422aa71b54a676234d17f8",
//     title: "Go To Statement Considered Harmful",
//     author: "Edsger W. Dijkstra",
//     url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
//     likes: 5,
//     __v: 0
//   },
//   {
//     _id: "5a422b3a1b54a676234d17f9",
//     title: "Canonical string reduction",
//     author: "Edsger W. Dijkstra",
//     url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
//     likes: 12,
//     __v: 0
//   },
//   {
//     _id: "5a422b891b54a676234d17fa",
//     title: "First class tests",
//     author: "Robert C. Martin",
//     url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
//     likes: 10,
//     __v: 0
//   },
//   {
//     _id: "5a422ba71b54a676234d17fb",
//     title: "TDD harms architecture",
//     author: "Robert C. Martin",
//     url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
//     likes: 0,
//     __v: 0
//   },
//   {
//     _id: "5a422bc61b54a676234d17fc",
//     title: "Type wars",
//     author: "Robert C. Martin",
//     url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
//     likes: 2,
//     __v: 0
//   }  
// ]

beforeEach(async () =>{
  await Blog.deleteMany({})

  let blogObject = new Blog(helper.initialBlogs[0])
  await blogObject.save()

  blogObject = Blog(helper.initialBlogs[1])
  await blogObject.save()

  blogObject = Blog(helper.initialBlogs[2])
  await blogObject.save()

  blogObject = Blog(helper.initialBlogs[3])
  await blogObject.save()

  blogObject = Blog(helper.initialBlogs[4])
  await blogObject.save()

  blogObject = Blog(helper.initialBlogs[5])
  await blogObject.save()


  blogObject = Blog(helper.initialBlogs[6])
  await blogObject.save()

  
})




//initialize db before every test with beforeEach function
// beforeEach(async () => {
//   await Blog.deleteMany({})
//   let blogObject = new Blog(initialBlogs[0])
//   await blogObject.save()
//   blogObject = new Blog(initialBlogs[1])
//   await blogObject.save()
//   blogObject = new Blog(initialBlogs[2])
//   await blogObject.save()
//   blogObject = new Blog(initialBlogs[3])
//   await blogObject.save()
//   blogObject = new Blog(initialBlogs[4])
//   await blogObject.save()
//   blogObject = new Blog(initialBlogs[5])
//   await blogObject.save()
//   blogObject = new Blog(initialBlogs[6])
//   await blogObject.save()
// })

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
}, 100000)

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('a specific blog is within the returned blogs', async () => {
  const response = await api.get('/api/blogs')

  const contents = response.body.map(r => r.content)

  expect(contents).toContain(
    'Browser can execute only Javascript'
  )
})


test('a valid blog can be added ', async () => {
  const newBlog = {

    _id: "5a422a851b54a676234d17f7",
    title: "'async/await simplifies making async calls'",
    author: "Test Author",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0,
  
    important: true,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.notesInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

  const contents = blogsAtEnd.map(n => n.content)
  expect(contents).toContain(
    'async/await simplifies making async calls'
  )
})





//test length of blogs

test('there are  7 blogs', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body).toHaveLength(7)
})

test('blog without content is not added', async ()=>{
  const newBlog = {
    important: true
  }

  await 
  api
  .post('/api/blogs')
  .send(newBlog)
  .expect(400)

  const blogsAtEnd = await helper.blogsInDb()

  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
})


afterAll(() => {
  mongoose.connection.close()
})