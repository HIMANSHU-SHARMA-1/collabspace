const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    bio: { type: String, required:true, default:'No bio yet'},
    githubProfile: { type: String, },
    profilePicture: { type: String},
    skills: [{ name: {type:String,}, rating:{type: Number} }],
},{timestamps: true})

const User = mongoose.model('User', userSchema)

module.exports = User;