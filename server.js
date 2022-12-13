import express from 'express'
const app = express()
import dotenv from 'dotenv'
dotenv.config()
import 'express-async-errors'
import morgan from 'morgan'
import clean from "xss-clean"
import helmet from "helmet"
import sanitize from "express-mongo-sanitize"
import cors from "cors"

import SwaggerUI from "swagger-ui-express"
import YAML from 'yamljs'
const SwaggerDocs=YAML.load("./Swagger.yaml")




import connectDB from './db/connect.js'
import Auth from "./routes/AuthRoute.js"
import Jobs from "./routes/JobRoute.js"



import notFoundMiddleware from './middleware/not-found.js'
import errorHandlerMiddleware from './middleware/error-handler.js'
import authenticateUser from './middleware/auth.js'

// import Auth from "../routes/AuthRoute.js"


if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'))
}


app.use(express.json())
app.use(helmet())
app.use(clean())
app.use(sanitize())

app.use(cors())

// This setip is now not working on the local host
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();});


app.set('trust proxy', 1);

app.get("/",(req,res)=>{
  res.send('<h1><a href="/api-docs">See The Docs</a></h1>')
})

app.use('/api-docs', SwaggerUI.serve, SwaggerUI.setup(SwaggerDocs));

app.use("/api/v1/auth",Auth)
app.use("/api/v1/jobs",authenticateUser,Jobs)


app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)


const port = process.env.PORT || 5000

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL)
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}...`)
    })
  } catch (error) {
    console.log(error)
  }
}

start()
