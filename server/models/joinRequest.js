const mongoose = require('mongoose')

const requestSchema = new mongoose.Schema({
    project:{type:mongoose.Schema.Types.ObjectId, ref:'Project'},
    requestee:{type:mongoose.Schema.Types.ObjectId, ref:'User'},
    reciever:{type:mongoose.Schema.Types.ObjectId, ref:'User'},
    status:{type:String, enum:['pending','approved','rejected'],default:'pending'}
},{timestamps:true})

const Request = mongoose.model('Request',requestSchema)

module.exports = Request;