import mongoose = require('mongoose')

interface ISkill{
    name:string,
    rating:number
}

interface IUser extends mongoose.Document{
    username:string,
    email:string,
    password:string,
    bio:string,
    githubProfile:string,
    profilePicture:string,
    skills:ISkill[]
}

const userSchema = new mongoose.Schema<IUser>({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    bio: { type: String, required:true, default:'No bio yet'},
    githubProfile: { type: String, },
    profilePicture: { type: String},
    skills: [{ name: {type:String,}, rating:{type: Number} }],
},{timestamps: true})

const User = mongoose.model<IUser>('User', userSchema)

export = User;