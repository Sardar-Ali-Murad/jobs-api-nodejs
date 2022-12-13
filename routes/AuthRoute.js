import express from "express"
let router=express.Router()

import {Login,Register} from "../controllers/Users.js"


router.route("/register").post(Register)

router.route("/login").post(Login)


export default router