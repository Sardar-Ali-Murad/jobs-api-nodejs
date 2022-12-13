import Auth from "../models/Auth.js";
import JobsModel from "../models/JobsModel.js"
import {BadRequestError,UnAuthenticatedError,NotFoundError}  from "../errors/index.js"
import {StatusCodes} from "http-status-codes"


const createJob=async (req,res)=>{
    let {name,position}=req.body
    if(!name || !position ){
        throw new BadRequestError("Please Provide All The Values")
    }

    req.body.createdBy=req.user.userId

    let job=await JobsModel.create({...req.body})

    res.status(StatusCodes.CREATED).json({job})
    
}


const currentUserJobs=async (req,res)=>{
    let jobs=await JobsModel.find({createdBy:req.user.userId})
    
    res.status(200).json({jobs})
}


const deleteJob=async (req,res)=>{
    let {id}=req.params

    let job=await JobsModel.findOne({_id:id})

    if(!job){
        throw new NotFoundError("The Job Not Found")
    }
    
    if(job.createdBy!=req.user.userId){
        throw new BadRequestError("Invalid Action")
    }

    await job.remove()


    res.status(StatusCodes.OK).json({job})
}



const updateJob=async (req,res)=>{
    let {id}=req.params

    let {status}=req.body

    if(!status){
        throw new BadRequestError("Please Provide The Status To Proceed")
    }

    let job=await JobsModel.findOne({_id:id})
    
    if(job.createdBy!=req.user.userId){
        throw new BadRequestError("Invalid Action")
    }

    
    job.status=status

    await job.save()

    res.status(StatusCodes.OK).json({job})
}

const getAllJobs=async (req,res)=>{
    let jobs=await JobsModel.find({}).populate("createdBy","-password -_id")
    res.status(200).json({jobs})
}




export {createJob,currentUserJobs,deleteJob,updateJob,getAllJobs}


