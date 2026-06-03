const Project = require('../models/Project')
// const authController = require('../controllers/authController')

const createProject = async(req,res)=>{
    try{
        const {projectname, requiredSkill, teamsize, githubLink, description, leader, members, status} = req.body
        // const isProjectExist = await Project.findOne({projectname})
        // if(isProjectExist){
        //     return res.status(400).json({
        //         success:false,
        //         message:'Project already existed'
        //     })
        // }
        const project = new Project({
            projectname,
            requiredSkill,
            teamsize,
            githubLink,
            description,
            leader:req.user.id,
            members,
            status

        })
        const savedProject = await project.save()
        res.status(201).json({
            success:true,
            message:'Project created successfully',
            data:{
                id:savedProject._id,
                projectname:savedProject.projectname,
                requiredskill:savedProject.requiredSkill,
                teamsize:savedProject.teamsize,
                githublink:savedProject.githubLink,
                leader:savedProject.leader,
                members:savedProject.members,
                status:savedProject.status

            }
        })
    }
    catch(err){
        res.status(500).json({
            message:err.message
        })
    }
}

const getAllProjects = async(req,res)=>{
    try{
        const getProjects = await Project.find().populate('leader', 'username email')
        return res.status(200).json({
            success:true,
            statuscode:200,
            message:'projects found',
            data:getProjects

        })    
    }catch(err){
        res.status(500).json({
            message:err.message
        })
    }
}

const getProjectbyID = async(req,res)=>{
    try{
        const projectByid = await Project.findById(req.params.id).populate('leader' ,'username email').populate('members', 'username email')
        if(projectByid){
            return res.status(200).json({
                success:true,
                statusCode:200,
                message:'project found',
                data:projectByid
            })
        }
        else{
            res.status(404).json({
                success:false,
                statusCode:404,
                message:'project not found',
            })
        }
             
        
    }
    catch(err){
        res.status(500).json({
            message:err.message||'internal server error'
        })
    }
            
}

const updateProjects = async(req,res)=>{
    const {projectname,requiredSkill,githubLink,description} = req.body
   try{
    const updateProject = await Project.findByIdAndUpdate(req.params.id,
        {
           $set:{
            projectname,
            requiredSkill,
            githubLink,
            description
           }
        },{new:true,runValidators:true}
    )
    if(updateProject){
        return res.status(200).json({
            success:true,
            statusCode:200,
            message:'Project found and updated',
            data:updateProject
        })
    }
    else{
        return res.status(404).json({
            success:false,
            statusCode:404,
            message:'project not found'
        })
   }
}
    catch(err){
        res.status(500).json({
            message:err.message||'Internal Server Error'
        })
    }
}

const deleteProjects = async(req,res)=>{
    try{
        const deleteProject = await Project.findByIdAndDelete(req.params.id)
    if(deleteProject){
        return res.status(200).json({
            success:true,
            statuscode:200,
            message:'project Deleted Successfully',
        })
    }
    else{
        return res.status(404).json({
            success:false,
            message:'project not found'
        })
    }
    }
    catch(err){
        res.status(500).json({
            message:err.message || 'internal server error'
        })
    }
}


module.exports= {createProject,getAllProjects, getProjectbyID, updateProjects, deleteProjects}