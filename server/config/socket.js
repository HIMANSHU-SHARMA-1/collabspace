const Message = require('../models/Message')

module.exports = (io) =>{

    io.on('connection', (socket)=>{
        //user connected log
        console.log('A user connected', socket.id)
    
        //listen for joinRoom Event
        
        socket.on('joinRoom', (projectId)=>{
            //join room with projectId
            socket.join(projectId)
            console.log(`User joined the room ${projectId}`)
        })
    //listen for sendMessage Event
    socket.on('sendMessage', async (data)=>{
        const {projectId, senderId, content} = data
        const message = new Message({
            sender: senderId,
            project: projectId,
            content: content
        })
         
        const savedMessage = await message.save()
        io.to(projectId).emit('receiveMessage', savedMessage)
    })
    
    //listen for disconnect event log
    socket.on('disconnect', ()=>{
        console.log('User Disconnected:', socket.id)
    })
    
    })
}


