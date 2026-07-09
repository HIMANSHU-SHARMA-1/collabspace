const Message = require('../models/Message')

    const getProjectMessages = async (req,res)=>{
        try{
            const projectMessages = await Message.find({project: req.params.projectId}).sort({
                createdAt: 1,

            }).populate('sender', 'username email')
            res.status(200).json({
            success:true,
            statusCode:200,
            message:"loaded Messages",
            data: projectMessages
        })
        
    }
    catch(err){
        res.status(500).json({
            message:err.message ||'Internal Server Error'
        })

    }
    }

module.exports = {getProjectMessages}