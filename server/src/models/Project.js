const mongoose = require('mongoose')

const projectSchema = new mongoose.Schema({
    projectname:{type:String,required:true},
    requiredSkill:[{type:String}],
    teamsize:{type:Number},
    githubLink:{type:String},
    description:{type:String},
    leader:{type:mongoose.Schema.Types.ObjectId, ref:'User', required:true},
    members:[{type:mongoose.Schema.Types.ObjectId, ref:'User'}],
    status:{type:String, enum:['open','in-progress','done'], default:'open'}
}, {timestamps:true})

const Project = mongoose.model('Project', projectSchema)

module.exports=Project;