require('./instrument')
import cors = require('cors')
import http = require('http')
import socketio = require('socket.io')
const {Server} = socketio
import express = require('express')
import type {Request,Response} from 'express'
require('dotenv').config()
import connectDB =  require('./config/db')
import authRoutes = require('./routes/authRoutes')
import projectRoutes = require('./routes/projectRoutes')
import joinRequestRoutes = require('./routes/joinRequestRoutes')
import messageRoutes = require('./routes/messageRoutes')
import notificationRoutes = require('./routes/notificationRoutes')
import aiRoutes = require('./routes/aiRoutes')
const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN
}))

const server = http.createServer(app)
const io = new Server(server,{
    cors:{
        origin:process.env.CORS_ORIGIN,
    }
})
app.set('io', io)

const initSocket = require('./config/socket')
initSocket(io)



app.use(express.json())

app.get('/', (req:Request,res:Response)=>{
    res.send('Collabspace Server is Running')
})

app.use('/api/auth',authRoutes)
app.use('/api/project',projectRoutes)
app.use('/api/joinRequest',joinRequestRoutes)
app.use('/api/message',messageRoutes)
app.use('/api/notifications', notificationRoutes)
app.use('/api/openAi',aiRoutes)

import Sentry = require('@sentry/node')
Sentry.setupExpressErrorHandler(app)

//for test to trigger
if(require.main === module){
    connectDB()
    server.listen(process.env.PORT, ()=>{
        console.log(`Server is Running on https://localhost:${process.env.PORT}`)
    })

}
module.exports = app