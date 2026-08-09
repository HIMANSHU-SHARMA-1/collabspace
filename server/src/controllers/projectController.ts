const Project = require('../models/Project')
const Request = require('../models/joinRequest')
// const authController = require('../controllers/authController')
const Notification = require('../models/notification')

const createProject = async(req,res)=>{
    try{
        const {projectname, requiredSkill, teamsize, githubLink, description, members, status} = req.body
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

const getJoinedProjects = async(req,res)=>{
   try{
    const getProjects = await Project.find({members:req.user.id}).populate('leader', 'username email')
    if(getProjects.length === 0){
        return res.status(200).json({
            success:true,
            data:[]
        })
    }
    res.status(200).json({
        success:true,message:'Projects found',data:getProjects
    })
   }catch(err){
    res.status(500).json({
        message:err.message||'Internal server Error!'
    })
   }
}

//fetch all the projects where req.user.id === leader
const getMyProjects = async(req,res)=>{
try{
    const myProjects = await Project.find({leader:req.user.id}).populate('leader','username email')
    if(!myProjects.length===0){
        return res.status(404).json({
            message:"You haven't created any project"
        })
    }

         res.status(200).json({
            success:true,
            statusCode:200,
            message:'Found Projects',
            data:myProjects
        })

}
catch(err){
    res.status(500).json({
        message:err.message || 'Internal server Error'
    })
}
}

const updateProjects = async(req,res)=>{
    const {projectname,requiredSkill,githubLink,description,teamsize,status} = req.body
   try{
    const project = await Project.findById(req.params.id)
    if(!project){
        return res.status(404).json({message:'project not found'})
    }
    if(project.leader.equals(req.user.id )){
        const updateProject = await Project.findByIdAndUpdate(req.params.id,
            {
               $set:{
                projectname,
                requiredSkill,
                githubLink,
                description,
                teamsize,
                status
               }
            },{new:true,runValidators:true}
        )
        if(updateProject){
                    return res.status(200).json({
                        success:true,
                        message:'Project updated successfully',
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
    }else{
            return res.status(403).json({
                message:'You are not authorized to Updated Project'
            })
        }
    
}
    catch(err){
        res.status(500).json({
            message:err.message||'Internal Server Error'
        })
    }
}
const removeMember = async (req, res) => {
    try {
        const {projectId, memberId} = req.params

        const project = await Project.findById(projectId)
        if(!project){
            return res.status(404).json({message:'Project not found'})
        }
        if(!project.leader.equals(req.user.id)){
            return res.status(403).json({message:'You are not authorized to remove members.'})
        } 
        const memberExists = project.members.some(member=>member.equals(memberId))
        if(!memberExists){
            return res.status(404).json({message:'Member not found in this project.'})
        }
        //remove member
        project.members = project.members.filter(
            member=> !member.equals(memberId)
        )
        await project.save()

        //create notification for at the time of member removing
        await Notification.create({
            user:memberId,
            message:`You have been removed from the project "${project.projectname}".`
        })

        const updatedProject = await Project.findById(projectId).populate('leader','username email').populate('members', 'username email')

        res.status(200).json({
            success:true,
            message:'Member removed successfully.',
            data:updatedProject
        })

    } catch (err) {
        res.status(500).json({
            message: err.message || 'Internal Server Error'
        })
    }
}

const deleteProjects = async(req,res)=>{
    try{
        const project = await Project.findById(req.params.id)
        if(!project){
            return res.status(404).json({message:'Project not found to delete'})
        }
        if(!project.leader.equals(req.user.id)){
            return res.status(403).json({success:false,message:'Unauthaorized activity'})
        }
        const deleteProject = await Project.findByIdAndDelete(req.params.id)
    if(deleteProject){
        await Request.deleteMany({project:req.params.id})
        return res.status(200).json({
            success:true,
            statuscode:200,
            message:'project Deleted Successfully',
        })
    }else{
        return res.status(404).json({message:'Project not found to delete'})
    }
    
    }
    catch(err){
        res.status(500).json({
            message:err.message || 'internal server error'
        })
    }
}


module.exports= {createProject,getAllProjects, getProjectbyID, updateProjects, deleteProjects,getMyProjects, getJoinedProjects, removeMember}