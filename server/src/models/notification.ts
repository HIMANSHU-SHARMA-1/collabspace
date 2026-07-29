import mongoose = require('mongoose')

interface INotification extends mongoose.Document{
    user:mongoose.Types.ObjectId,
    message:string,
    isRead:boolean
}

const notificationSchema = new mongoose.Schema<INotification>({
    user:{type:mongoose.Schema.Types.ObjectId, ref:'User', required:true},
        message:{type:String,required:true},
        isRead:{type:Boolean,default:false}
},{timestamps:true})

const Notification = mongoose.model<INotification>('Notification',notificationSchema)
export = Notification