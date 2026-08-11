import jwt = require('jsonwebtoken')
import type { Request, Response, NextFunction } from 'express'
import type express = require('../types/express')

const auth = async(req:Request,res:Response,next:NextFunction)=>{
    try{
        const token = req.headers.authorization?.split(' ')[1]
        if(!token){
            return res.status(401).json({
                success:false,
                message:'login required'
            })
        }

        if(!process.env.JWT_SECRET){
            throw new Error('JWT_SECRET is not defined')
        }
        const decode = jwt.verify(token, process.env.JWT_SECRET)

        if(typeof decode === 'string' || typeof decode.id !== 'string'){
            return res.status(400).json({message:'Invalid token format'})
        }
        req.user= decode as express.AuthTokenPayload
        next()
    }
    catch(err:unknown){
        return res.status(400).json({
            message: err instanceof Error? err.message :'Unknown error'
        })
    }
}

export = auth