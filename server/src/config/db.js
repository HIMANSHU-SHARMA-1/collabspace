const mongoose = require('mongoose')

const connectDB = async ()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log('Databse connectivity Successfully Established')
    }
    catch(err){
        console.log('Databse connectivity Failed', err.message)
        process.exit(1)

    }
}
module.exports = connectDB