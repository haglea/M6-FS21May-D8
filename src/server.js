import express from "express"
import listEndpoints from "express-list-endpoints"
import mongoose from 'mongoose'

import blogPostsRouter from "./services/blogPosts/index.js"
import commentsRouter from "./services/comments/index.js"

const server = express()

const port = process.env.PORT || 3002

// ******************** MIDDLEWARES ******************

server.use(express.json())

// ******************* ROUTES ***********************

server.use("/blogPosts", blogPostsRouter)
server.use("/comments", commentsRouter)

// ******************* ERROR HANDLERS ******************



mongoose.connect(process.env.MONGO_CONNECTION)

mongoose.connection.on("connected", () => {
  console.log('Successfully connected to mongo!')
  server.listen(port, () => {
    console.table(listEndpoints(server))
    console.log("Server is running on port ", port)
  })
})

mongoose.connection.on("error", err => {
  console.log("MONGO ERROR: ", err)
})