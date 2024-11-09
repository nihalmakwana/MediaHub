import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Video } from "../models/video.model.js";

const uploadVideo = asyncHandler ( async (req, res) => {
    try {
        const { userId, title, videoUrl, imageUrl, description } = req.body
    
        const video = await Video.create({
            userId,
            title,
            desc: description,
            imageUrl,
            videoUrl
        })

        if (!video) {
            throw new ApiError(500, "Something went wrong while uploading video")
        }
    
        return res
        .status(200)
        .json(
            new ApiResponse(200, video, "Video Uploaded Successfully!!!")
        )
    } catch (error) {
        throw new ApiError(500, error?.message || "Something went wrong while creating video")
    }
})

const getAllVideos = asyncHandler( async (req, res) => {
    try {
        const videos = await Video.find().populate('userId', 'name avatar')
        return res
        .status(200)
        .json(
            new ApiResponse(200, videos, "All videos fetch successfully")
        )
    } catch (error) {
        throw new ApiError(500, "Failed to fetch videos")
    }
})

export {
    uploadVideo,
    getAllVideos
}