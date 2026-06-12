const {testAIConnection} = require('../services/aiServices')

const testAi = async(req,res)=>{
    try{
        const response = await testAIConnection()
    res.status(200).json({
        success:true,
        message:response
    })
    }
    catch(err){
        res.status(500).json({message:err.message})
    }
}
module.exports={testAi}