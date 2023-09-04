import PostModel from "../Models/postModel.js";
import UserModel from "../Models/userModel.js";
import { dataUri } from "../utils/dataUriParser.js";
import cloudinary from "cloudinary";

// creating a post

export const createPost = async (req, res) => {
  try {
    const { caption } = req.body;
    const file = req.file;
    if (!file) {
      throw new Error(400, "Please upload an image");
    }
    const fileUri = dataUri(file);

    const myCloud = await cloudinary.v2.uploader.upload(fileUri.content);
    const newPost = await PostModel.create({
      caption,
      userId: req.userId,
      image: {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      },
    });
    res.status(200).json(newPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get a post

export const getPost = async (req, res) => {
  try {
    const id = req.params.id;
    const post = await PostModel.findById(id);
    res.status(200).json({ success: true, post });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// update post
export const updatePost = async (req, res) => {
  try {
    const { caption } = req.body;
    const postId = req.params.id;
    const _id = req.userId;

    const post = await PostModel.findById(postId);
    if (post.userId.toString() === _id.toString()) {
      await post.updateOne({ caption: caption });
      await post.save();
      res.status(200).json({ success: true, message: "Post updated!" });
    } else {
      res.status(403).json("Authentication failed");
    }
  } catch (error) {
    res.status(403).json(error);
  }
};

// delete a post
export const deletePost = async (req, res) => {
  const id = req.params.id;
  const _id = req.userId;

  try {
    const post = await PostModel.findById(id);
    if (post.userId.toString() === _id.toString()) {
      await post.deleteOne();
      res.status(200).json("Post deleted.");
    } else {
      res.status(403).json("Action forbidden");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

// like/dislike a post
export const likePost = async (req, res) => {
  try {
    const id = req.params.id;
    const _id = req.userId;
    console.log("id", _id);
    const post = await PostModel.findById(id);
    const isAlreadyLiked = post.likes.find((like) => {
      return like.user_Id.toString() === _id.toString();
    });
    if (isAlreadyLiked) {
      await post.updateOne({ $pull: { likes: { user_Id: _id } } });
      res.status(200).json({ success: true, message: "Post Disliked" });
    } else {
      await post.updateOne({ $push: { likes: { user_Id: _id } } });
      res.status(200).json({ success: true, message: "Post Liked" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const _id = req.userId;
    const posts = await PostModel.find({ userId: _id });
    res.status(200).json({ success: true, posts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getTimelinePosts = async (req, res) => {
  try {
    const _id = req.userId;
    console.log(_id,"id")
    const userId = _id.toString();
    const currentUser = await UserModel.findById(userId);

    if (!currentUser) {
      return res
        .status(403)
        .json({ success: false, message: "User not found" });
    }
    console.log("user authenctaed")
    const followingIds = [
      userId,
      ...currentUser.following.map((follow) => follow.following_Id),
    ];
    const timelinePosts = await PostModel.find({
      userId: { $in: followingIds },
    }).populate("userId", ["username", "firstname", "lastname", "image"]);
    
   
    timelinePosts.reverse();
    res.status(200).json({success:true,message:"Post Fetch Successfully",post:timelinePosts});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
