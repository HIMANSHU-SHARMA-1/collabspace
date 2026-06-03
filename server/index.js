const express = require('express')
require('dotenv').config()
const connectDB =  require('./config/db')
const authRoutes = require('./routes/authRoutes')
const projectRoutes = require('./routes/projectRoutes')
const joinRequestRoutes = require('./routes/joinRequestRoutes')


const app = express()

connectDB()

app.use(express.json())

app.get('/', (req,res)=>{
    res.send('Collabspace Server is Running')
})

app.use('/api/auth',authRoutes)
app.use('/api/project',projectRoutes)
app.use('/api/joinRequest',joinRequestRoutes)

app.listen(process.env.PORT, ()=>{
    console.log(`Server is Running on https://localhost:${process.env.PORT}`)
})