import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";

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

const getVideoDetails = asyncHandler( async (req, res) => {
    try {
        const { id } = req.params 

        const video = await Video.findById(id).populate("userId", "name avatar")

        return res 
        .status(200)
        .json(
            new ApiResponse(200, video, "Video Fetch Successfully!!")
        )
    } catch (error) {
        throw new ApiError(500, error?.message || "Something went wrong while fetching video details")
    }
})

const like = asyncHandler( async (req, res) => {
    const { videoId } = req.params
    const userId = req.user._id
    
    try {
        const video = await Video.findById(videoId)
        if (!video) {
            throw new ApiError(404, "Video Not Found")
        }

        if (!video.likes.includes(userId)) {
            video.likes.push(userId)
            video.dislikes = video.dislikes.filter( id => id.toString() !== userId.toString())

            await User.findByIdAndUpdate(userId, { $addToSet: { likedVideo: videoId }})
        } else {
            video.likes = video.likes.filter(id => id.toString() !== userId.toString())
            await User.findByIdAndUpdate(userId, { $pull: { likedVideo: videoId }})
        }

        await video.save()

        return res
        .status(200)
        .json(
            new ApiResponse(200, video, "Video liked/disliked successfully")
        )
    } catch (error) {
        throw new ApiError(500, error?.message || "Something went wrong while liked and disliked video")
    }
})

const dislike = asyncHandler( async (req, res) => {
    const { videoId } = req.params
    const userId = req.user._id

    try {
        const video = await Video.findById(videoId)
        if (!video) {
            throw new ApiError(404, "Video not Found")
        }

        if (!video.dislikes.includes(userId)) {
            video.dislikes.push(userId)
            video.likes = video.likes.filter(id => id.toString() !== userId.toString())

            await User.findByIdAndUpdate(userId, { $addToSet: { dislikedVideo: videoId }})
        } else {
            video.dislikes = video.dislikes.filter(id => id.toString() !== userId.toString())
            await User.findByIdAndUpdate(userId, { $pull: { dislikedVideo: videoId }})
        }

        await video.save()

        return res
        .status(200)
        .json(
            new ApiResponse(200, video, "Video liked/disliked successfully..")
        )
    } catch (error) {
        throw new ApiError(500, error?.message || "Something went wrong while liked and disliked video")
    }
})

const getLikedVideo = asyncHandler( async (req, res) => {
    const userId = req.user._id

    try {
        const likedVideo = await Video.find({ likes: userId }).populate("userId", "name avatar").exec()

        return res
        .status(200)
        .json(
            new ApiResponse(200, likedVideo, "All liked video fetched successfully")
        )
    } catch (error) {
       throw new ApiError(500, error?.message || "Something went wrong while getting liked video") 
    }
})

const getdisikedVideo = asyncHandler( async (req, res) => {
    const userId = req.user._id

    try {
        const dislikedVideo = await Video.find({ dislikes: userId }).populate("userId", "name avatar").exec()

        return res
        .status(200)
        .json(
            new ApiResponse(200, dislikedVideo, "All disliked video fetched successfully")
        )
    } catch (error) {
       throw new ApiError(500, error?.message || "Something went wrong while getting disliked video") 
    }
})

const getUserVideo = asyncHandler( async (req, res) => {
    const userId = req.user._id

    try {
        const videos = await Video.find({ userId })

        return res 
        .status(200)
        .json(
            new ApiResponse(200, videos, "Get user's all video successfully...")
        )
    } catch (error) {
        throw new ApiError(500, error?.message || "Something went wrong while getting user's videos")
    }
})

const deleteVideo = asyncHandler( async (req, res) => {
    try {
        const { videoId } = req.params
        const deletedVideo = await Video.findByIdAndDelete(videoId)
        if (!deletedVideo) {
            throw new ApiError(404, "Video Not Found")
        } 

        return res
        .status(200)
        ,json(
            new ApiResponse(200, {}, "Video Deleted Successfully!!")
        )
    } catch (error) {
      throw new ApiError(500, error?.message || "Something went wrong while deleting music")  
    }
})

export {
    uploadVideo,
    getAllVideos,
    getVideoDetails,
    like,
    dislike,
    getLikedVideo,
    getdisikedVideo,
    getUserVideo,
    deleteVideo
}