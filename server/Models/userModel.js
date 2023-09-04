import mongoose from "mongoose"
import bcrypt from "bcrypt"

const UserSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    image:{
    public_id: {
      type:String,
      required:true
    },
    url:{
      type:String,
      required:true
    }
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
   profilePicture: String,
    coverPicture: String,
    about: String,
    livesIn: String,
    worksAt: String,
    relationship: String,
    country: String,
    followers: [
      {
        follower_Id :{
          type :mongoose.Schema.Types.ObjectId,

        }
      }
    ],
    following: [
      {
        following_Id :{
          type :mongoose.Schema.Types.ObjectId,

        }
      }
    ],
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if(!this.isModified("password")) return next() 
  const salt = await bcrypt.genSalt();
  this.password =await bcrypt.hash(this.password, salt);
  next();
});

const UserModel = mongoose.model("Users", UserSchema);
export default UserModel;
