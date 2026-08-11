import mongoose = require('mongoose')

const connectDB = async ()=>{
    try{
        if(!process.env.MONGO_URI){
            throw new Error('Mongo Uri is not defined')
        }
        await mongoose.connect(process.env.MONGO_URI)
        console.log('Databse connectivity Successfully Established')
    }
    catch(err){
        console.log('Databse connectivity Failed', err instanceof Error? err.message:'Unknown Error')
        process.exit(1)

    }
}
export = connectDB