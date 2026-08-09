import mongoose = require('mongoose')


interface IMessage extends mongoose.Document {
    sender:mongoose.Types.ObjectId,
    project:mongoose.Types.ObjectId,
    content:string
}

const messageSchema = new mongoose.Schema<IMessage>({
    sender:{type:mongoose.Schema.Types.ObjectId, ref:'User',required:true},
    project:{type:mongoose.Schema.Types.ObjectId, ref:'Project', required:true},
    content:{type:String, required:true}
},{timestamps:true})

const Message = mongoose.model<IMessage>('Message', messageSchema)
export = Message;