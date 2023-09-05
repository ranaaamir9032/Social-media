import UserModel from "../Models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { dataUri } from "../utils/dataUriParser.js";
import cloudinary from "cloudinary";

const maxAge = 3 * 24 * 60 * 60;
export const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWTKEY, {
    expiresIn: maxAge,
  });
};
// Register new user
export const Signup = async (req, res) => {
  try {
    const { username, password, firstname, lastname } = req.body;
    // console.log(req.body,"hello this")
    const exist = await UserModel.findOne({ username });

    if (exist) return res.status(401).json({ message: "User already exists" });

    const file = req.file;
    if (!file) {
      throw new Error(400, "Please upload an image");
    }
    const fileUri = dataUri(file);

    const myCloud = await cloudinary.v2.uploader.upload(fileUri.content);
    console.log(myCloud , "mycloud");
    const user = await UserModel.create({
      username,
      password,
      firstname,
      lastname,
      image: {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      },
    });

    // console.log(UserModel.create,"UserModel")

    console.log(user);

    const token = createToken(user._id);
    res.status(200).json({ message: "Register Successfully", user, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const Login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await UserModel.findOne({ username });

    if (!user) {
      throw new Error("incorrect email and password");
    }
    const isMatchpassword = await bcrypt.compare(password, user.password);
    //  console.log(isMatchpassword)
    if (!isMatchpassword) {
      throw new Error("incorrect email and password");
    }
    const token = await createToken(user._id);
    const options={
      expires:new Date(Date.now()+ 15 * 24 * 60 * 60 * 1000),
      httpOnly:true,
      secure:true,
     sameSite:"none"
  }
    res.status(200).cookie("token",token,options).json({ message: "Loggin Successfully", user,token });
  } catch (error) {
    res.status(500).json({ message: error.message });
    
  }
};

export const getMyProfile=async(req,resp)=>{
  try {
   
   const user_id =req.userId
    const user= await UserModel.findOne({_id :user_id})

    resp.status(200).json({
      success:true,
      user
    })
  } catch (error) {
    resp.status(500).json({ message: error.message });
  }
}

export const logout =async(req ,res)=>{

  res.status(200).cookie("token",null,{
      expires:new Date(Date.now()),
      httpOnly:true,
      secure:true,
      sameSite:"none"
      
  }).json({
      success:true,
      message:"Logout Successfully"
  })

}