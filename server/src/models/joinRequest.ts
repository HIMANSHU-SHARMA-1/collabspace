import mongoose = require('mongoose')

interface IJoinRequest extends mongoose.Document{
    project: mongoose.Types.ObjectId,
    requestee: mongoose.Types.ObjectId,
    receiver: mongoose.Types.ObjectId,
    status:'pending'|'approved'|'rejected',
}

const requestSchema = new mongoose.Schema<IJoinRequest>({
    project:{type:mongoose.Schema.Types.ObjectId, ref:'Project'},
    requestee:{type:mongoose.Schema.Types.ObjectId, ref:'User'},
    receiver:{type:mongoose.Schema.Types.ObjectId, ref:'User'},
    status:{type:String, enum:['pending','approved','rejected'],default:'pending',required:true}
},{timestamps:true})

const Request = mongoose.model<IJoinRequest>('Request',requestSchema)

export = Request;