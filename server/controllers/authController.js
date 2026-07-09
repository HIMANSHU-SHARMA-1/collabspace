const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

//! this function below register and check the if user exist or not,and hashing password processing, it uses a new method of creating a user which first creates a user and then save it to db
const register = async(req,res)=>{
   try{
    const{username, email,  password, bio, skills, githubProfile} = req.body
    const existingUser = await User.findOne({email})
    if(existingUser){
       return res.status(400).json({
            success:false,
            message:'User with that email already exists'
        })
    }
    const hashedPassword = await bcrypt.hash(password,10)
    const user = new User({
        username,
        email,
        password: hashedPassword,
        bio,
        githubProfile,
        skills,
    })
    const savedUser = await user.save()
    return res.status(201).json({
        success:true,
        statusCode:200,
        message:'User registered successfully',
        data:{
            id:savedUser._id,
            username:savedUser.username,
            email:savedUser.email,
            skills:savedUser.skills
        } 
    })
   }
   catch(err){
    res.status(500).json({
        message:err.message
    })
   }
}

const login = async(req,res)=>{
    try{
        // console.log('login route hit')

    const{email,  password} = req.body

        const findUser = await User.findOne({email})
        if(!findUser){
            return res.status(404).json({
                message:'User not found'
            })
        }
         const isMatch = await bcrypt.compare(password, findUser.password)
         if(!isMatch){
            return res.status(400).json({
                message:'Invalid credentials'
            })
         }
        const token = jwt.sign(
            {id:findUser._id},
            process.env.JWT_SECRET,
            {expiresIn:'7d'}
        )
        res.status(200).json({
            success:true,
            token:token,
            data:{
                id:findUser._id,
                username:findUser.username,
                email:findUser.email
            }
        })
       
    }
    catch(err){
        console.log('login error:', err.message)
        res.status(500).json({
            message: err.message
        })
    }
    // catch(err){
    //    res.status(500).json({
    //     message:err.message
    //    })
    // }
}

const getCurrentUser =async(req,res)=>{
    try{
        const user = await User.findById(req.user.id)
    if(!user){
        return res.status(404).json({success:false,message:'User not Found'})
    }
    res.status(200).json({
        success:true,
        message:'User Found',
        data:{
            username:user.username,
            email:user.email,
            bio:user.bio,
            githubProfile:user.githubProfile,
            skills:user.skills,
            profilePicture:user.profilePicture
        }
    })
    }catch(err){
        res.status(500).json({
            success:false,
            message:err.message || 'Internal server error'
        })

    }
}

const updateProfile = async(req,res)=>{
    try{
        const {username, bio, githubProfile, skills} = req.body
        const updateUser = await User.findByIdAndUpdate(req.user.id,
            {$set:{username,bio,githubProfile,skills}},
            {new:true,runValidators:true}
        ).select('-password')
        if(!updateUser){
            return res.status(404).json({success:false,message:'User not found'})
        }
        res.status(200).json({
            success:true,
            message:'Profile updated Successfully',
            data: updateUser
        })
    }catch(err){
        res.status(500).json({ message: err.message || 'Internal server error' });
    }
}

module.exports= {register,login,getCurrentUser,updateProfile}