import type {Server, Socket} from 'socket.io'
import Message = require('../models/Message')

interface sendMessagePayload{
    projectId:string,
    senderId:string,
    content:string
}

const initSocket = (io:Server) =>{

    io.on('connection', (socket:Socket)=>{
        //user connected log
        console.log('A user connected', socket.id)
    
        //listen for joinRoom Event
        
        socket.on('joinRoom', (projectId:string)=>{
            //join room with projectId
            socket.join(projectId)
            console.log(`User joined the room ${projectId}`)
        })
        //Listen for event per user to send message
        socket.on('registerUser',(UserId:string)=>{
            socket.join(UserId)
        })
    //listen for sendMessage Event
    socket.on('sendMessage', async (data:sendMessagePayload)=>{
        const {projectId, senderId, content} = data
        const message = new Message({
            sender: senderId,
            project: projectId,
            content: content
        })
         
        const savedMessage = await (await message.save()).populate('sender','username email')
        io.to(projectId).emit('receiveMessage', savedMessage)
    })
    
    //listen for disconnect event log
    socket.on('disconnect', ()=>{
        console.log('User Disconnected:', socket.id)
    })
    
    })
}

export = initSocket


