import Project = require('../models/Project')
import User = require('../models/User')
import type {Request, Response} from 'express'
import aiServices = require('../services/aiServices')

const {testAIConnection, getProjectRecommendations} = aiServices

const testAi = async(req:Request,res:Response)=>{
    try{
        const response = await testAIConnection()
    res.status(200).json({
        success:true,
        message:response
    })
    }
    catch(err){
        res.status(500).json({success:false, message:err instanceof Error? err.message : 'Unknown Error'})
    }
}

const recommendProjects = async(req:Request,res:Response)=>{
   try{
    // console.time("Find User");
    if(!req.user){
        return res.status(404).json({success:false, message:'User not found'})
    }
    const user = await User.findById(req.user.id)
    // console.timeEnd("Find User");
    if(!user){
        return res.status(404).json({success:false,message:'User not found'})
    }

    // console.time("Find Projects");
    const project = await Project.find(
        {
            status:'open',
            leader:{$ne:req.user.id},
            members:{$ne:req.user.id}
        }
    )
    // console.timeEnd("Find Projects");

    if(project.length === 0){
        return res.status(404).json({message:'No open project for you to join now'})
    }
    // console.time("AI Recommendation");
    const recommendation = await getProjectRecommendations(
        user.skills,
        project
    )
    // console.timeEnd("AI Recommendation");
    res.status(200).json({sucess:true, data:recommendation})
   }
   catch(err){
    res.status(500).json({success:false, message:err instanceof Error? err.message : 'Unknown Error'})
   }
}
export={testAi, recommendProjects}