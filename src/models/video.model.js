import mongoose, { Schema } from "mongoose";

const videoSchema = new Schema(
    {
        userId: { type: String },
        title: { type: String },
        desc: { type: String },
        imageUrl: { type: String },
        videoUrl: { type: String },
        likes: { type: [String], default: [] },
        dislikes: { type: [String], default: [] }
    },
    { timestamps: true }
)

export const Video = mongoose.model("Video", videoSchema)