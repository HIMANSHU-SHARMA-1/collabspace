const cors = require('cors')
const http = require('http')
const {Server} = require('socket.io')
const express = require('express')
require('dotenv').config()
const connectDB =  require('./config/db')
const authRoutes = require('./routes/authRoutes')
const projectRoutes = require('./routes/projectRoutes')
const joinRequestRoutes = require('./routes/joinRequestRoutes')
const messageRoutes = require('./routes/messageRoutes')
const notificationRoutes = require('./routes/notificationRoutes')
const aiRoutes = require('./routes/aiRoutes')
const app = express()

app.use(cors({
    origin:'http://localhost:5173'
}))

const server = http.createServer(app)
const io = new Server(server,{
    cors:{
        origin:'*',
    }
})
app.set('io', io)

const initSocket = require('./config/socket')
initSocket(io)



app.use(express.json())

app.get('/', (req,res)=>{
    res.send('Collabspace Server is Running')
})

app.use('/api/auth',authRoutes)
app.use('/api/project',projectRoutes)
app.use('/api/joinRequest',joinRequestRoutes)
app.use('/api/message',messageRoutes)
app.use('/api/notifications', notificationRoutes)
app.use('/api/openAi',aiRoutes)

if(require.main === module){
    connectDB()
    server.listen(process.env.PORT, ()=>{
        console.log(`Server is Running on https://localhost:${process.env.PORT}`)
    })

}
module.exports = app