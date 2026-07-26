const Notification = require('../models/notification')


const getNotifications = async(req,res)=>{
    try{
        const notifications = await Notification.find({user:req.user.id}).sort({createdAt:-1})
        res.status(200).json({
            success:true,
            message:'notification fetched successfully',
            data:notifications
        })
    }
    catch(err){
        res.status(500).json({
            message:err.message || 'internal Server error'
        })

    }
}

const markAsRead = async(req,res)=>{
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
            message:err.message || 'Internal server error'
        })
    }
}

module.exports = {getNotifications, markAsRead};