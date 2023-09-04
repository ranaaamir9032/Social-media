import express from 'express'
import { createPost, deletePost, getPost,  getTimelinePosts,  getUserPosts,  likePost,  updatePost} from '../Controllers/PostController.js'
import { requireAuth } from '../Middlewares/userAuth.js'
import singleUpload from "../Middlewares/multer.js";
const router = express.Router()

router.post('/create',requireAuth,singleUpload,createPost)
router.get('/:id', getPost)
router.put('/:id',requireAuth, updatePost)
router.delete('/:id',requireAuth,deletePost)
router.put('/like/:id',requireAuth,likePost)
router.get('/user/timeline',requireAuth, getTimelinePosts)
router.get('/user/allpost',requireAuth, getUserPosts)




export default router

