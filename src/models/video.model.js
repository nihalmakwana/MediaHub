import mongoose, { Schema } from "mongoose";

const videoSchema = new Schema(
    {
        userId: { 
            type: Schema.Types.ObjectId, 
            ref: 'User', 
            required: true 
        },
        title: { 
            type: String, 
            required: true 
        },
        desc: { 
            type: String, 
            required: true 
        },
        imageUrl: { 
            type: String, 
            required: true 
        },
        videoUrl: { 
            type: String, 
            required: true 
        },
        likes: { 
            type: [Schema.Types.ObjectId],
            ref: "User", 
            default: [] 
        },
        dislikes: { 
            type: [Schema.Types.ObjectId],
            ref: "User", 
            default: [] 
        }
    },
    { timestamps: true }
)

export const Video = mongoose.model("Video", videoSchema)