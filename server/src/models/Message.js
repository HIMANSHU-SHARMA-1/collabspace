const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
    sender:{type:mongoose.Schema.Types.ObjectId, ref:'User',required:true},
    project:{type:mongoose.Schema.Types.ObjectId, ref:'Project', required:true},
    content:{type:String}
},{timestamps:true})

const Message = mongoose.model('Message', messageSchema)
module.exports = Message;