const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const helper = require('./test_helper')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')
const { application } = require('express')

describe('When there is initially one user in the db', ()=>{
    beforeEach(async ()=>{
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('sekret', 10)
        const user = new User({username: 'root', passwordHash})

        await user.save()
    })

    test('creation succeeds with a unique username', async()=>{
        const usersAtStart = await helper.usersInDb()
        console.log('length users in the db at beginning', usersAtStart.length)

        const newUser ={
            username: 'test',
            name: 'testName',
            password: 'password'
        }

        await api
        .post('/api/users/')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        console.log('length users after new one is added', usersAtEnd.length)
        
        const usernames = usersAtEnd.map(u => u.username)
        expect(usernames).toContain(newUser.username)

    })

    test('creation fails if username is already taken', async()=>{
        const usersAtStart = await helper.usersInDb();
        
        const newUser ={
            username: 'root',
            name : 'testUser',
            password: 'password'
        }

        const result = await api
        .post('/api/users/')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

        console.log('resulting message: ', result.body.error)

         expect(result.body.error).toContain('username must be unique')

         const usersAtEnd = await helper.usersInDb()
         expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test('creation fails if username is too short', async()=>{
        const usersAtStart = await helper.usersInDb()
        console.log('length of users at START', usersAtStart.length)

        const newUser = {
            username: 'to',
            name: 'testName',
            password:'password'
        }

        const result = await api
        .post('/api/users/')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

        console.log('result of sending the newUser: ', result.body)
        expect(result.body.error).toContain('username is shorter than minimum allowed length (3)')

     const usersAtEnd = await helper.usersInDb()
     console.log('length of users at END', usersAtEnd.length)

         expect(usersAtEnd).toHaveLength(usersAtStart.length)

    })

    test('creation fails with proper status code and message if password is too shorrt', async()=>{
        const usersAtStart = await helper.usersInDb()

        console.log('length of users at STARt', usersAtStart.length)

        const newUser ={
            username: 'tester',
            name: 'testName',
            password:'pa'
        }

        const result = await api
        .post('/api/users/')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

        console.log('result of sending the newUser: ', result.body)
        expect(result.body.error).toContain('password is shorter than minimum allowed length (3)')

        const usersAtEnd = await helper.usersInDb()
        console.log('length of users at END', usersAtEnd.length)

        expect(usersAtEnd).toHaveLength(usersAtStart.length)

    })

    afterAll(() => {
        mongoose.connection.close();
      })
   
})



