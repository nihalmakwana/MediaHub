import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Music } from "../models/music.model.js";
import { User } from "../models/user.model.js";
import { Video } from "../models/video.model.js";

const uploadMusic = asyncHandler( async (req, res) => {
    try {
        const { userId, singerName, songName, description, imageUrl, songFileUrl } = req.body
    
        if (!userId || !singerName || !songName || !description || !imageUrl || !songFileUrl) {
            throw new ApiError(401, "All fields are required")
        }

        const newMusic = await Music.create({
            userId,
            singerName,
            songName,
            desc: description,
            image: imageUrl,
            songFile: songFileUrl
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

const getMusicDetails = asyncHandler( async (req, res) => {
    try {
        const { id } = req.params

        const music = await Music.findById(id).populate("userId", "name avatar")

        return res
        .status(200)
        .json(
            new ApiResponse(200, music, "Music Fetched Successfully!!")
        )
    } catch (error) {
        throw new ApiError(500, error?.message || "Something went wrong while fetching music details")
    }
})

const like = asyncHandler( async (req, res) => {
    const { musicId } = req.params
    const userId = req.user._id

    try {
        const music = await Music.findById(musicId)
        if (!music) {
            throw new ApiError(404, "Music Not Found")
        }

        if (!music.likes.includes(userId)) {
            music.likes.push(userId)
            music.dislikes = music.dislikes.filter( id => id.toString() !== userId.toString())

            await User.findByIdAndUpdate(userId, { $addToSet: { likedMusic: musicId }})
        } else {
            music.likes = music.likes.filter( id => id.toString() !== userId.toString())
            await User.findByIdAndUpdate(userId, { $pull: { likedMusic: musicId }})
        }

        await music.save()

        return res
        .status(200)
        .json(
            new ApiResponse(200, music, "Music Liked/Disliked successfully")
        )
    } catch (error) {
        throw new ApiError(500, error?.message || "Something went wrong while liked/disliked music")
    }
})

const dislike = asyncHandler( async (req, res) => {
    const { musicId } = req.params
    const userId = req.user._id

    try {
        const music = await Music.findById(musicId)
        if (!music) {
            throw new ApiError(404, "Music not found")
        }

        if (!music.dislikes.includes(userId)) {
            music.dislikes.push(userId)
            music.likes = music.likes.filter( id => id.toString() !== userId.toString())

            await User.findByIdAndUpdate(userId, { $addToSet: { dislikedMusic: musicId }})
        } else {
            music.dislikes = music.dislikes.filter( id => id.toString() !== userId.toString())
            await User.findByIdAndUpdate(userId, { $pull: { dislikedMusic: musicId }})
        }

        await music.save()

        return res
        .status(200)
        .json(
            new ApiResponse(200, music, "Music liked/disliked successfully")
        )
    } catch (error) {
        throw new ApiError(500, error?.message || "Something went wrong while like/dislike music")
    }
})

const getLikedMusic = asyncHandler( async (req, res) => {
    const userId = req.user._id

    try {
        const likedMusic = await Music.find({ likes: userId}).populate("userId", "name avatar").exec()

        return res
        .status(200)
        .json(
            new ApiResponse(200, likedMusic, "All Liked Music Fetched Successfully")
        )
    } catch (error) {
       throw new ApiError(500, error?.message || "Something went wrong while getting liked video") 
    }
})

const getDislikedMusic = asyncHandler( async (req, res) => {
    const userId = req.user._id

    try {
        const dislikedMusic = await Music.find({ dislikes: userId}).populate("userId", "name avatar").exec()

        return res
        .status(200)
        .json(
            new ApiResponse(200, dislikedMusic, "All Liked Music Fetched Successfully")
        )
    } catch (error) {
       throw new ApiError(500, error?.message || "Something went wrong while getting disliked video") 
    }
})

const getUserMusic = asyncHandler( async (req, res) => {
    const userId = req.user._id

    try {
        const musics = await Music.find({ userId })

        return res
        .status(200)
        .json(
            new ApiResponse(200, musics, "Get user's all music successfully...")
        )
    } catch (error) {
        throw new ApiError(500, error?.message || "Something went wrong while getting user's music..")
    }
})

const deleteMusic = asyncHandler( async (req, res) => {
    const { musicId } = req.params 

    try {
        const deletedMusic = await Music.findByIdAndDelete(musicId)
        if (!deletedMusic) {
            throw new ApiError(404, "Music not found")
        }

        return res
        .status(200)
        .json(
            new ApiResponse(200, {}, "Music Deleted Successfully!!")
        )

    } catch (error) {
        throw new ApiError(500, error?.message || "Something went wrong while deleting music")
    }
})

export {
    uploadMusic,
    getAllMusic,
    getMusicDetails,
    like,
    dislike,
    getLikedMusic,
    getDislikedMusic,
    getUserMusic,
    deleteMusic
}