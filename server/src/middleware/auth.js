const jwt = require('jsonwebtoken')

const auth = async(req,res,next)=>{
    try{
        const token = req.headers.authorization?.split(' ')[1]
        if(!token){
            return res.status(401).json({
                success:false,
                message:'login required'
            })
        }

        const decode = jwt.verify(token, process.env.JWT_SECRET)
        req.user= decode
        next()
    }
    catch(err){
        return res.status(400).json({
            message:err.message
        })
    }
}

module.exports = auth