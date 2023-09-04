import express  from "express";
import  {Login, Signup, getMyProfile, logout} from "../Controllers/AuthController.js";
import singleUpload from "../Middlewares/multer.js";
import {requireAuth} from "../Middlewares/userAuth.js"
const router = express.Router()
router.post('/signup',singleUpload , Signup)
router.post('/login' , Login)
router.get('/me' ,requireAuth, getMyProfile)
router.get('/logout' , logout)

export default router;