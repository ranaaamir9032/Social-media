import UserModel from "../Models/userModel.js";
import cloudinary from "cloudinary";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { dataUri } from "../utils/dataUriParser.js";
// Get a User
export const getUser = async (req, res) => {
  const id = req.params.id;

  try {
    const user = await UserModel.findById(id);
    if (user) {
      const { password, ...otherDetails } = user._doc;

      res.status(200).json(otherDetails);
    } else {
      res.status(404).json("No such User found");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    let users = await UserModel.find().select("-password");
    if (users) {
      res.status(200).json({success:true , user : users , message:"AllUsers Get Successfully"});
    } else {
      throw new error(500);
    }
  } catch (error) {
    res.status(404).json({success:false, message:error.message});
  }
};

// udpate a user

export const updateUser = async (req, res) => {
  const id = req.userId;
  const currentuserId = req.userId;
  const { password } = req.body;
  if (id === currentuserId) {
    try {
      // if we also have to update password then password will be bcrypted again
      const user = await UserModel.findById({ _id: id });
      console.log(user.image.public_id, "findidUser");
      const destroy = await cloudinary.v2.uploader.destroy(
        user.image.public_id
      );
      console.log(destroy, "destroy");
      const file = req.file;
      console.log(file ,"file")
      if (!file) {
        throw new Error("Please Upload Poster", 400);
      }
      const fileUri = dataUri(file);
      const myCloud = await cloudinary.v2.uploader.upload(fileUri.content);

      if (password) {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(password, salt);
      }
      user.image = {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      }
      await user.save()
      console.log(user, "userdata");
      const token = jwt.sign(
        { username: user.username, id: user._id },
        process.env.JWTKEY,
        { expiresIn: "1h" }
      );
      res.status(200).json({ user, token });
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  } else {
    res
      .status(403)
      .json("Access Denied! You can update only your own Account.");
  }
};

// Delete a user
export const deleteUser = async (req, res) => {
  const id = req.params.id;

  const { currentUserId, currentUserAdmin } = req.body;

  if (currentUserId == id || currentUserAdmin) {
    try {
      await UserModel.findByIdAndDelete(id);
      res.status(200).json("User Deleted Successfully!");
    } catch (error) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("Access Denied!");
  }
};

//follow user
export const followUser = async (req, res) => {
  try {
    const id = req.params.id;
    // console.log(id , "person Id")
    const _id = req.userId;
    // console.log(_id ,"current login user")

    if (_id === id) {
      throw new Error("Action Forbidden");
    }

    const followUser = await UserModel.findById(id);
    const followingUser = await UserModel.findById(_id);

    const isAlreadyFollowing = followUser.followers.find(
      (follower) => follower.follower_Id.toString() === _id.toString()
    );

    if (!isAlreadyFollowing) {
      await followUser.updateOne({
        $push: { followers: { follower_Id: _id } },
      });
      await followingUser.updateOne({
        $push: { following: { following_Id: id } },
      });
      res.status(200).json({success : true , message:`You start following ${followUser.firstname} ${followUser.lastname}`,userId:followUser._id});
    } else {
      await followUser.updateOne({
        $pull: { followers: { follower_Id: _id } },
      });
      await followingUser.updateOne({
        $pull: { following: { following_Id: id } },
      });
      res.status(200).json({success : true , message:`You unfollowed ${followUser.firstname} ${followUser.lastname}`,userId:followUser._id});
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({success : false ,message:error.message});
  }
};
