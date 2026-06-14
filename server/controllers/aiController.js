const Project = require('../models/Project')
const User = require('../models/User')
const {testAIConnection, getProjectRecommendations} = require('../services/aiServices')

const testAi = async(req,res)=>{
    try{
        const response = await testAIConnection()
    res.status(200).json({
        success:true,
        message:response
    })
    }
    catch(err){
        res.status(500).json({message:err.message})
    }
}

const recommendProjects = async(req,res)=>{
   try{
    const user = await User.findById(req.user.id)
    if(!user){
        return res.status(404).json({success:false,message:'User not found'})
    }
    const project = await Project.find(
        {
            status:'open',
            leader:{$ne:req.user.id},
            members:{$ne:req.user.id}
        }
    )
    if(!project.length === 0){
        return res.status(404).json({message:'No open project for you to join now'})
    }
    const recommendation = await getProjectRecommendations(
        user.skills,
        project
    )
    res.status(200).json({sucess:true, data:recommendation})
   }
   catch(err){
    res.status(500).json({success:false,message:err.message})
   }
}
module.exports={testAi, recommendProjects}