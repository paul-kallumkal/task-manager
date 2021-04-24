const express = require('express')
const router = new express.Router()
const Task = require('../models/task')

router.post('/tasks', async (req, res) => {
    const task = new Task(req.body)
    try{
        await task.save()
        res.send(task)
    }
    catch(e){
        res.status(400).send(e)
    }
})

router.get('/tasks', async (req, res) => {
    try{
        const tasks = await Task.find({})
        res.send(tasks)
    }
    catch(e){
        res.status(500).send(e)
    }
})

router.get('/tasks/:id', async (req,res) => {
    try{
        const task = await Task.findById(req.params.id)
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    }
    catch(e){
        res.status(500).send(e)
    }
})

router.patch('/tasks/:id', async (req,res) => {
    const allowed = ['description','completed']
    const isValid = Object.keys(req.body).every((e) => allowed.includes(e))
    if(!isValid){
        return res.status(400).send({error: 'Invalid variables'})
    }
    try{
        const task = await Task.findById(req.params.id)
        Object.keys(req.body).forEach((e) => task[e] = req.body[e])
        await task.save()
        
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    }
    catch(e){
        res.status(500).send(e)
    }
}) 

router.delete('/tasks/:id', async (req,res) =>{
    try{
        const task = await Task.findByIdAndDelete(req.params.id)
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