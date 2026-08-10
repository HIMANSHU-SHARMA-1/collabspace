import Project = require('../models/Project')
import joinRequest = require('../models/joinRequest')
import type {Request,Response} from 'express'
// const authController = require('../controllers/authController')
import Notification = require('../models/notification')


interface ProjectBody{
    projectname:string,
    teamsize:number,
    requiredSkill:string[],
    githubLink:string,
    description:string,
    members:string[],
    status:string
    

}
const createProject = async(req:Request<{},{},ProjectBody>,res:Response)=>{
    try{
        const {projectname, requiredSkill, teamsize, githubLink, description, members, status} = req.body
        if(!req.user){
            return res.status(404).json({success:false,message:'User not found'})
        }
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
            message:err instanceof Error? err.message : 'Unknown error'

        })
    }
}

const getAllProjects = async(req:Request,res:Response)=>{
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
            message:err instanceof Error? err.message : 'Unknown error'

        })
    }
}

const getProjectbyID = async(req:Request<{id:string}>,res:Response)=>{
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
            message:err instanceof Error? err.message : 'Unknown error'

        })
    }
            
}

const getJoinedProjects = async(req:Request,res:Response)=>{
   try{
    if(!req.user){
        return res.status(404).json({success:false,message:'User not found'})
    }
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
        message:err instanceof Error? err.message : 'Unknown error'

    })
   }
}

//fetch all the projects where req.user.id === leader
const getMyProjects = async(req:Request,res:Response)=>{
try{
    if(!req.user){
        return res.status(404).json({success:false,message:'User not found'})
    }
    const myProjects = await Project.find({leader:req.user.id}).populate('leader','username email')
    if(myProjects.length===0){
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
        message:err instanceof Error? err.message : 'Unknown error'

    })
}
}


interface updateProjectBody{
    projectname:string,
    requiredSkill:string[],
    githubLink:string,
    description:string,
    teamsize:number,
    status:string
    
}
const updateProjects = async(req:Request<{id:string},{},updateProjectBody>,res:Response)=>{
    const {projectname,requiredSkill,githubLink,description,teamsize,status} = req.body
   try{
    const project = await Project.findById(req.params.id)
    if(!project){
        return res.status(404).json({message:'project not found'})
    }
    if(!req.user){
        return res.status(404).json({success:false,message:'User not found'})
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
            message:err instanceof Error? err.message : 'Unknown error'

        })
    }
}
const removeMember = async (req:Request<{projectId:string, memberId:string}>,res:Response) => {
    try {
        const {projectId, memberId} = req.params

        const project = await Project.findById(projectId)
        if(!project){
            return res.status(404).json({message:'Project not found'})
        }
        if(!req.user){
            return res.status(404).json({success:false,message:'User not found'})
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
            message:err instanceof Error? err.message : 'Unknown error'

        })
    }
}

const deleteProjects = async(req:Request<{id:string}>,res:Response)=>{
    try{
        const project = await Project.findById(req.params.id)
        if(!project){
            return res.status(404).json({message:'Project not found to delete'})
        }
        if(!req.user){
            return res.status(404).json({success:false,message:'User not found'})
        }
        if(!project.leader.equals(req.user.id)){
            return res.status(403).json({success:false,message:'Unauthaorized activity'})
        }
        const deleteProject = await Project.findByIdAndDelete(req.params.id)
    if(deleteProject){
        await joinRequest.deleteMany({project:req.params.id})
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
            message:err instanceof Error? err.message : 'Unknown error'
        })
    }
}


export= {createProject,getAllProjects, getProjectbyID, updateProjects, deleteProjects,getMyProjects, getJoinedProjects, removeMember}