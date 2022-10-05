const bcrypt = require('bcrypt')

const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async(request, response)=>{
    const users = await User
    .find({})
    .populate('blogs', {title: 1, likes: 1})

    response.json(users)
})

usersRouter.post('/', async(request, response)=>{
    const {username, name, password} = request.body

    //TODO add verification if the user already exists

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
        username,
        name,
        passwordHash
    })

    const savedUser = await user.save();

    response.status(201).json(savedUser)
})



module.exports = usersRouter