const Request = require('../models/joinRequest')
const Project = require('../models/Project')

const sendRequest = async(req,res)=>{
    try{
        const requesteeId = req.user.id
        const {projectId} = req.body

        const project = await Project.findById(projectId)
        if(!project){
            return res.status(404).json({
                success:false,
                statusCode:404,
                message:'project not found',
            })
        }
        const recieverId = project.leader
        const isRequest = await Request.findOne({project:projectId,requestee:requesteeId})
        if(isRequest){
            return res.status(400).json({
                message:'already applied'
            })
        }
        else{
            const newRequest = new Request({
                project:projectId,
                requestee:requesteeId,
                reciever:recieverId,
                status:'pending'
            })
        const savedRequest = await newRequest.save()
        res.status(201).json({
            success:true,
            statusCode:201,
            message:'Request Created successfully',
            data:{
                id:savedRequest._id,
                project:savedRequest.project,
                requestee: savedRequest.requestee,
                reciever:savedRequest.reciever
            }
        })

        }
        
    }
    catch(err){
        res.status(500).json({
            message:err.message||'Internal server error'
        })
    }
}

const approveRequest = async(req,res)=>{
    try{
        const request = await Request.findByIdAndUpdate(req.params.id,{
            $set:{status:'approved'},
        },{new:true,runValidators:true})
        if(!request){
            return res.status(404).json({
                success:false,
                message:'request not found'
            })
        }

        const project = await Project.findByIdAndUpdate(request.project,{
            $push:{members: request.requestee}
        })
        
        res.status(200).json({
                success:true,
                statuscode:200,
                message:'Request accepted'
            })
        
        
    }
    catch(err){
        res.status(500).json({
            message:err.message||'Internal server error'
        })
    }
}

const rejectRequest = async(req,res)=>{
    try{
        const request = await Request.findByIdAndUpdate(req.params.id,{
            $set:{status:'rejected'}
        },{new:true,runValidators:true})
        if(!request){
            return res.status(404).json({
                success:false,
                message:'request not found'
            })
        }
        res.status(200).json({
            success:true,
            statuscode:200,
            message:'request rejected successfully'
        })
    }
    catch(err){
        res.status(500).json({
            message:err.message || 'internal server error'
        })
    }
}

const getAllRequest = async(req,res)=>{
    try{
        const allRequest = await Request.find({project:req.params.projectId}).populate('requestee','username email')
            res.status(200).json({
            success:true,
            statusCode:200,
            message:'Request found',
            data: allRequest
        })

    }
    catch(err){
        res.status(500).json({
            message:err.message || 'internal server error'
        })

    }
}
module.exports= {sendRequest, approveRequest, rejectRequest, getAllRequest};