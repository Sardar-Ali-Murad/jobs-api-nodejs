
import mongoose from "mongoose";

let JobSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please Provide The Name Of The Job"]
    },
    
    position:{
        type:String,
        required:[true,"Please Provide The Position"]
    },
    
    status:{
        type:String,
      enum:["decline","pending"],
      default:"decline"
    }, 

    createdBy:{
        type:mongoose.Types.ObjectId,
        ref:"DocsUserTests"
    }
    
})


export default  mongoose.model("DocsAppJobs",JobSchema)