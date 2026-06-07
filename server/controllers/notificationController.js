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

module.exports = {getNotifications};