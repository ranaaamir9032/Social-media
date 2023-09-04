import express  from "express";
import {requireAuth} from "../Middlewares/userAuth.js"
import { deleteUser, followUser, getAllUsers, getUser, updateUser } from "../Controllers/UserController.js";
import singleUpload from "../Middlewares/multer.js";


const router = express.Router()
router.get('/:id', getUser);
router.get('/',getAllUsers)
router.put('/',requireAuth,singleUpload, updateUser)
router.delete('/:id', deleteUser)
router.patch('/follow/:id', requireAuth,  followUser)


export default router;