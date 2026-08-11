import mongoose = require('mongoose')
export  interface ISkill{
    name:string,
    rating:number
}

export interface IProject extends mongoose.Document{
    projectname:string,
    requiredSkill:string[],
    teamsize:number,
    githubLink:string,
    description:string,
    leader:mongoose.Types.ObjectId,
    members:mongoose.Types.ObjectId[],
    status:'open'|'in-progress'|'done'
}