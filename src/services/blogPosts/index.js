// ----------------------------- blogPosts CRUD ---------------------
import express from "express"
import BlogPostModel from './schema.js'
import CommentModel from "../comments/schema.js"

const blogPostsRouter = express.Router()

blogPostsRouter.get("/", async (req, res, next) => {
    try {
        const blogPosts = await BlogPostModel.find({})       
        res.send(blogPosts);  
    } catch (error) {
        next(error)
    }    
})

blogPostsRouter.get("/:blogPostId", async (req, res, next) => {
    try {       
    const blogPostId = req.params.blogPostId
    const blogPost = await BlogPostModel.findById(blogPostId)
    res.send(blogPost)
    } catch (error) {
        next(error)
    }
})

blogPostsRouter.post("/", async (req, res, next) => {
    try {      
    const newBlogPost = new BlogPostModel(req.body) // here happens validation of the req.body, if it's not ok mongoose will throw a "ValidationError"
    const {_id} = await newBlogPost.save()   

    res.status(201).send({ _id })
    
    } catch (error) {
        next(error)
  }
})

blogPostsRouter.put("/:blogPostId", async (req, res, next) => {
    try {       
        const blogPostId = req.params.blogPostId
        const updatedBlogPost = await BlogPostModel.findByIdAndUpdate(blogPostId, req.body, {
            new: true // returns the updated blogPost
        })
    
    response.send(updatedBlogPost)
    } catch (error) {
        next(error)
    }
})

blogPostsRouter.delete("/:blogPostId", async (req, res, next) => {
    try {       
        const blogPostId = req.params.blogPostId
        const deletedBlogPost = await BlogPostModel.findByIdAndDelete(blogPostId)

    res.status(204).send(deletedBlogPost)
    } catch (error) {
        next(error)
    }
})


// ----------------------------- blogPosts comments CRUD ---------------------


blogPostsRouter.post("/:blogPostId", async (req, res, next) => {
    try {
      // BlogPostId is received in the req.body. Given this id we want to insert the corresponding comment
      // into the comments array (an array that belongs to the specified blogPost :blogPostId)
  
      // 1. Find comment by id
  
      const newComment = await CommentModel.findById(req.body.commentId, { _id: 0 }) //always create a new id
  
      if (newComment) {
        // 2. If the comment is found, add additional info to that object like createDate
  
        const commentToInsert = { ...newComment.toObject(), createDate: new Date() } // newComment is a DOCUMENT not a normal object, therefore I need to convert it into a JS object to be able to spread it
  
        // 3. Update the specified blogPost by adding the comment to the array
  
        const updatedBlogPost = await BlogPostModel.findByIdAndUpdate(
          req.params.blogPostId, // who you want to modify
          { $push: { comments: commentToInsert } }, // how you want to modify him/her
          { new: true } // options
        )
        if (updatedBlogPost) {
          res.send(updatedBlogPost)
        } else {
          next(`BlogPost with id ${req.params.blogPostId} not found!`)
        }
      } else {
        next(`Comment with id ${req.body.commentId} not found!`)
      }
    } catch (error) {
      next(error)
    }
  })
  
  blogPostsRouter.get("/:blogPostId/comments", async (req, res, next) => {
    try {
        const blogPost = await BlogPostModel.findById(req.params.blogPostId)

        if (blogPost) {
          res.send(blogPost.comments)
        } else {
          next(`BlogPost with id ${req.params.blogPostId} not found!`)
        }
    } catch (error) {
      next(error)
    }
  })
  
  blogPostsRouter.get("/:blogPostId/comments/:commentId", async (req, res, next) => {
    try {
        const blogPost = await BlogPostModel.findById(req.params.blogPostId)
        if (blogPost) {
            const comment = blogPost.comments.find(c => c._id.toString() === req.params.commentId)
            if (comment) {
                res.send(comment)
              } else {
                next(`Comment with id ${req.params.commentId} not found in comments!`)
              }
            } else {
              next(`BlogPost with id ${req.params.blogPostId} not found!`)
            }
    } catch (error) {
      next(error)
    }
  })
  
  blogPostsRouter.put("/:blogPostId/comment/:commentId", async (req, res, next) => {
    try {

        const blogPost = await BlogPostModel.findOneAndUpdate(
            { _id: req.params.blogPostId, "comments._id": req.params.commentId },
            {
              $set: {
                "comments.$": req.body, // $ is the POSITIONAL OPERATOR, it represents the index of the found comment in the comments array
              },
            },
            { new: true }
          )
      
          if (blogPost) {
            res.send(blogPost)
          } else {
            next(`BlogPost with id ${req.params.blogPostId} not found!`)
          }

    } catch (error) {
      next(error)
    }
  })
  
  blogPostsRouter.delete("/:blogPostId/comment/:commentId", async (req, res, next) => {
    try {

        const blogPost = await BlogPostModel.findByIdAndUpdate(
            req.params.blogPostId, // who we want to modify
            {
              $pull: {
                // how we want to modify
                comments: { _id: req.params.commentId },
              },
            },
            {
              new: true,
            }
          )
      
          if (blogPost) {
            res.send(blogPost)
          } else {
            next(`BlogPost with id ${req.params.blogPostId} not found!`)
          }


    } catch (error) {
      next(error)
    }
  })
  
export default blogPostsRouter