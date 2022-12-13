import express from "express"

let router=express.Router()

import {createJob,currentUserJobs,deleteJob,updateJob,getAllJobs} from "../controllers/JobsController.js"


router.route("/").post(createJob).get(currentUserJobs)

router.route("/:id").delete(deleteJob).put(updateJob)

router.route("/getAllJobs").get(getAllJobs)

export default router