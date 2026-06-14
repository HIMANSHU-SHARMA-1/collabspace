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
    console.time("Find User");
    const user = await User.findById(req.user.id)
    console.timeEnd("Find User");
    if(!user){
        return res.status(404).json({success:false,message:'User not found'})
    }

    console.time("Find Projects");
    const project = await Project.find(
        {
            status:'open',
            leader:{$ne:req.user.id},
            members:{$ne:req.user.id}
        }
    )
    console.timeEnd("Find Projects");

    if(!project.length === 0){
        return res.status(404).json({message:'No open project for you to join now'})
    }
    console.time("AI Recommendation");
    const recommendation = await getProjectRecommendations(
        user.skills,
        project
    )
    console.timeEnd("AI Recommendation");
    res.status(200).json({sucess:true, data:recommendation})
   }
   catch(err){
    res.status(500).json({success:false,message:err.message})
   }
}
module.exports={testAi, recommendProjects}