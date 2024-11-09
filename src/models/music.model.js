import mongoose, { Schema } from "mongoose";

const musicSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        singerName: {
            type: String,
            required: true
        },
        songName: {
            type: String,
            required: true
        },
        desc: {
            type: String,
            required: true
        },
        image: {
            type: String,
            required: true
        },
        audio: {
            type: String,
            required: true
        },
        likes: {
            type: [String],
            default: []
        },
        dislikes: {
            type: [String],
            default: []
        }
    },
    {
        timestamps: true
    }
)

export const Music = mongoose.model("Music", musicSchema)