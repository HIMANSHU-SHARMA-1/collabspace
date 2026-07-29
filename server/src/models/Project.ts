import mongoose = require('mongoose')

interface IProject extends mongoose.Document{
    projectname:string,
    requiredSkill:string[],
    teamsize:number,
    githubLink:string,
    description:string,
    leader:mongoose.Types.ObjectId,
    members:mongoose.Types.ObjectId[],
    status:'open'|'in-progress'|'done'
}

const projectSchema = new mongoose.Schema<IProject>({
    projectname:{type:String,required:true},
    requiredSkill:[{type:String}],
    teamsize:{type:Number},
    githubLink:{type:String},
    description:{type:String},
    leader:{type:mongoose.Schema.Types.ObjectId, ref:'User', required:true},
    members:[{type:mongoose.Schema.Types.ObjectId, ref:'User'}],
    status:{type:String, enum:['open','in-progress','done'], default:'open'}
}, {timestamps:true})

const Project = mongoose.model<IProject>('Project', projectSchema)

export=Project;