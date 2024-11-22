import mongoose, { mongo, Schema } from "mongoose";

const playlistSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        name: {
            type: String,
            required: true
        },
        items: [
            {
                itemId: {
                    type: Schema.Types.ObjectId,
                    refPath: 'items.type',
                    required: true
                },
                type: {
                    type: String,
                    enum: ['video', 'music'],
                    required: true
                }
            }
        ],
        createdAt: {
            type: Date,
            default: Date.now
        }
    }
)

export const Playlist = mongoose.model("Playlist", playlistSchema)