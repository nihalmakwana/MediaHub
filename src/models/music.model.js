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
        songFile: {
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
    {
        timestamps: true
    }
)

export const Music = mongoose.model("Music", musicSchema)