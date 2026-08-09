import User = require('../models/User')
import bcrypt = require('bcryptjs')
import jwt = require('jsonwebtoken')
import type {Request, Response} from 'express'


interface RegisterBody{
    username:string,
    email:string,
    password:string,
    bio?:string,
    skills?:{name:string,rating:number}[],
    githubProfile?:string
}

//! this function below register and check the if user exist or not,and hashing password processing, it uses a new method of creating a user which first creates a user and then save it to db
const register = async(req:Request<{},{},RegisterBody>,res:Response)=>{
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
        message:err instanceof Error ? err.message:'Unknown Error'
    })
   }
}


interface LoginBody{
    email:string,
    password:string
}

const login = async(req:Request<{},{},LoginBody>,res:Response)=>{
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

         if(!process.env.JWT_SECRET){
            throw new Error('JWT Secret is not defined')
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
        // console.log('login error:', err.message)
        res.status(500).json({
            message: err instanceof Error? err.message:'Unknown Error'
        })
    }
  
}


const getCurrentUser =async(req:Request,res:Response)=>{
    try{
        if(!req.user){
            return res.status(401).json({success:false, message:'Unauthorized'})
        }
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
            message: err instanceof Error? err.message : 'Internal server error'
        })

    }
}


interface UpdateProfileBody {
    username?:string,
    bio?:string,
    githubProfile?:string,
    skills?:{name:string,rating:number}[]
}

const updateProfile = async(req:Request<{},{},UpdateProfileBody>,res:Response)=>{
    try{
        if(!req.user){
            return res.status(404).json({success:false, message: 'Unauthorized'})
        }
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
        res.status(500).json({
             message: err instanceof Error? err.message : 'Internal server error' 
    })
    }
}

export= {register,login,getCurrentUser,updateProfile}