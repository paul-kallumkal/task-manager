const express = require('express')
const router = new express.Router()
const Task = require('../models/task')
const auth = require('../middleware/auth')

router.post('/tasks', auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })
    try{
        await task.save()
        res.status(201).send(task)
    }
    catch(e){
        res.status(400).send(e)
    }
})

router.get('/tasks', auth,  async (req, res) => {
    const match = {}
    const sort = {}
    if(req.query.completed){
        match.completed = req.query.completed === "true"
    }
    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    try{
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.send(req.user.tasks)
    }
    catch(e){
        res.status(500).send(e)
    }
})

router.get('/tasks/:id', auth, async (req,res) => {
    
    try{
        const task = await Task.findOne({ _id:req.params.id, owner: req.user._id})
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    }
    catch(e){
        res.status(500).send(e)
    }
})

router.patch('/tasks/:id', auth, async (req,res) => {
    const allowed = ['description','completed']
    const isValid = Object.keys(req.body).every((e) => allowed.includes(e))
    if(!isValid){
        return res.status(400).send({error: 'Invalid variables'})
    }
    try{
        const task = await Task.findOne({_id:req.params.id, owner: req.user._id})
        
        if(!task){
            return res.status(404).send()
        }

        Object.keys(req.body).forEach((e) => task[e] = req.body[e])
        await task.save()

        res.send(task)
    }
    catch(e){
        res.status(500).send(e)
    }
}) 

router.delete('/tasks/:id', auth, async (req,res) =>{
    try{
        const task = await Task.findOneAndDelete({_id:req.params.id, owner: req.user._id})
        if(!task){
            return res.status(404).send({error: "Task not found"})
        }
        res.send(task)
    }
    catch(e){
        res.status(400).send(e)
    }
})

module.exports = router