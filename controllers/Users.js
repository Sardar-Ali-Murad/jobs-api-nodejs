import Auth from "../models/Auth.js"
import {BadRequestError,UnAuthenticatedError,NotFoundError} from "../errors/index.js"
import {StatusCodes} from "http-status-codes"

let Register=async (req,res)=>{
    let {name,password,email}=req.body

    if(!name || !password || !email){
        throw new BadRequestError("Please Provide All Credentials")
    }

    let emailAlreadyExists=await Auth.findOne({email})

    if(emailAlreadyExists){
        throw new BadRequestError("Email Already Exists")
    }

    let user=await Auth.create({name,password,email})

    let token =user.createJWT()

    res.status(StatusCodes.CREATED).json({
        user:{name,email},
        token:token
    })
}



let Login=async (req,res)=>{
    let {password,email}=req.body
    
    if(!password || !email){
        throw new BadRequestError("Please Provide All Credentials")
    }
    
    let user=await Auth.findOne({email})
    if(!user){
        throw new BadRequestError("User Does Not Exists")
    }

    let isPasswordCorrect=await user.comparePassword(password)
    
    if(!isPasswordCorrect){
        throw new BadRequestError('Password is not correct')
    }
   
    
    let token =user.createJWT()
    
    res.status(StatusCodes.CREATED).json({
        user:{name:user.name,email,image:user.image},
        token:token

    })
    
}





export {Register,Login}