import Message = require('../models/Message')
import type {Request, Response} from 'express'
// import type {ApiResponse} from '../types/api'
import catchAsync = require('../utils/catchAsync')

    const getProjectMessages = catchAsync( async (req: Request<{projectId:string}>,res:Response)=>{

            const projectMessages = await Message.find({project: req.params.projectId}).sort({
                createdAt: 1,

            }).populate('sender', 'username email').lean()
            res.status(200).json({
            success:true,
            statusCode:200,
            message:"loaded Messages",
            data: projectMessages
        })
        

    })

    export = {getProjectMessages}
    