import mongoose from "mongoose";

const postSchema = mongoose.Schema(
  {
    caption: {
      type: String,
      required: true,
    },
    likes: [
     {
      user_Id:{
        type: mongoose.Schema.Types.ObjectId
      }
     }
    ],
    createdAt: {
      type: Date,
      default: new Date(),
    },
    image: {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },

    userId: {
       type: mongoose.Schema.Types.ObjectId,
       ref : "Users"
      },
  },
  {
    timestamps: true,
  }
);

var PostModel = mongoose.model("Posts", postSchema);

export default PostModel;
