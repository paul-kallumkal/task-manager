const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const Task = require('./task')

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true
       
    },
    age:{
        type: Number,
        trim:true,
        default: 0,
        validate(val){
            if(val<0)
                throw new Error("Age must be positive")
        }
    },
    email:{
        unique: true,
        type: String,
        required: true,
        trim: true,
        validate(val){
            if(!validator.isEmail(val))
            throw new Error("Invalid email")
        }
    },
    password:{
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(val){
            if(val.toLowerCase().includes("password"))
            throw new Error("Password can't have \"password\"")
        }
    },
    tokens:[{
        token:{
            type:String,
            required: true
        } 
    }]
},{
    timestamps:true
})

userSchema.virtual('tasks',{
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.methods.AuthToken = async function () {
    const token = jwt.sign({_id: this.id.toString()}, process.env.JWT_SECRET)
    this.tokens = this.tokens.concat({token})
    await this.save()
    return token
} 

userSchema.methods.toJSON = function() {
    const user = this.toObject()

    delete user.password
    delete user.tokens
    return user
}

userSchema.statics.findByData = async (email,pass) => {
    const user = await User.findOne({email})
    if(!user){
        throw new Error('Incorrect credentials')
    }
    const matched = await bcrypt.compare(pass,user.password)
    if(!matched){
        throw new Error('Incorrect credentials')
    }
    return user
}

userSchema.pre('save',async function(next){
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password, 7)
    }
    next()
})

userSchema.pre('remove',async function(next){
    await Task.deleteMany({owner:this._id})
    next()
})

const User = mongoose.model('User',userSchema)

module.exports = User