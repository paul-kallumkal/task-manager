const express = require('express')
const router = new express.Router()
const auth = require('../middleware/auth')
const User = require('../models/user')

router.post('/users', async (req, res) => {
    const user = new User(req.body)
    try{
        const token = await user.AuthToken()
        await user.save()
        res.status(201).send({user,token})
    }
    catch(e){
        res.status(400).send(e)
    }
})

router.post('/users/login', async (req,res) => {
    try{
        const user = await User.findByData(req.body.email,req.body.password)
        const token = await user.AuthToken()
        res.send({user ,token})
    }
    catch(e){
        res.status(400).send({error:"Invalid Credentials"})
    }
})

router.post('/users/logout', auth, async (req,res) => {
    try{
        req.user.tokens = req.user.tokens.filter((t) => {
            return t.token !== req.token
        })
        await req.user.save()
        res.send()
    }catch(e){
        req.status(500).send()

    }
})

router.post('/users/logoutAll', auth, async (req,res) => {
    try{
        req.user.tokens = []
        await req.user.save()
        res.send()
    }catch(e){
        req.status(500).send()
    }
})

router.get('/users/me', auth, async (req, res) => {
  res.send(req.user)
})

router.patch('/users/me',auth, async(req,res) =>{
    const allowed = ['name','password','age','email']
    const isValid =  Object.keys(req.body).every((e) => allowed.includes(e))
    if(!isValid){
        return res.status(400).send({error: 'Invalid variables'})
    }
    try{
        Object.keys(req.body).forEach((e) => req.user[e] = req.body[e])
        await req.user.save()
        res.send(req.user)
    }
    catch(e){
        res.status(400).send(e)
    }
})

router.delete('/users/me', auth, async (req,res) =>{
    try{
        await req.user.remove()
        res.send(req.user)
    }
    catch(e){
        res.status(400).send(e)
    }
})

module.exports = router
