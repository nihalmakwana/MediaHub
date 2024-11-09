import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Music } from "../models/music.model.js";

const uploadMusic = asyncHandler( async (req, res) => {
    try {
        const { userId, singerName, songName, description, imageUrl, audioUrl } = req.body
    
        if (!userId || !singerName || !songName || !description || !imageUrl || !audioUrl) {
            throw new ApiError(401, "All fields are required")
        }

        const newMusic = await Music.create({
            userId,
            singerName,
            songName,
            desc: description,
            image: imageUrl,
            audio: audioUrl
        })

        if (!newMusic) {
            throw new ApiError(500, "Something went wrong while uploading music")
        }

        return res
        .status(200)
        .json(
            new ApiResponse(200, newMusic, "Music Uploaded Successfully!!!")
        )
    } catch (error) {
        throw new ApiError(500, error?.message || "Something went wrong while creating music")
    }
})

const getAllMusic = asyncHandler( async (req, res) => {
    try {
        const music = await Music.find().populate('userId', 'name avatar')

        return res
        .status(200)
        .json(
            new ApiResponse(200, music, "All music fetch successfully!!!")
        )
    } catch (error) {
        throw new ApiError(500, error?.message || "Something went wrong while fetching music")
    }
})

export {
    uploadMusic,
    getAllMusic
}