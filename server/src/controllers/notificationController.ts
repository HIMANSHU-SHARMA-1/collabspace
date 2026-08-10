import Notification = require('../models/notification')
import type {Request, Response} from 'express'


const getNotifications = async(req: Request, res: Response)=>{
    try{
        if(!req.user){
            return res.status(404).json({success:false, message:'User not found'})
        }
        const notifications = await Notification.find({user:req.user.id}).sort({createdAt:-1})
        res.status(200).json({
            success:true,
            message:'notification fetched successfully',
            data:notifications
        })
    }
    catch(err){
        res.status(500).json({
            message:err instanceof Error? err.message : 'Unknown error'
        })

    }
}

const markAsRead = async(req:Request<{id:string}>,res:Response)=>{
    try{
        const notification = await Notification.findByIdAndUpdate(req.params.id,{
            $set:{isRead:true}
        },{new:true,runValidators:true})
        if(!notification){
            return res.status(404).json({
                message:'Notification not found'
            })
        }
        res.status(200).json({
            success:true,
            message:'Notification marked as read'
        })

    }
    catch(err){
        res.status(500).json({
            message:err instanceof Error? err.message : 'Unknown error'
        
        })
    }
}

export = {getNotifications, markAsRead};