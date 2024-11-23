import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Admin } from "../models/admin.model.js"
import { User } from "../models/user.model.js"
import { Video } from "../models/video.model.js"
import { Music } from "../models/music.model.js"

const generateAccessAndRefreshToken = async (adminId) => {
    try {
        const admin = await Admin.findById(adminId)
        const accessToken = admin.generateAccessToken()
        const refreshToken = admin.generateRefreshToken()

        admin.refreshToken = refreshToken
        admin.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating tokens")
    }
}

const options = {
    httpOnly: true,
    secure: true
}

const adminLogin = asyncHandler( async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        throw new ApiError(400, "All fields are required!!!")
    }

    const admin = await Admin.findOne({ email })
    if (!admin) {
        throw new ApiError(400, "Admin does not exits")
    }

    const isPasswordValid = await admin.isPasswordCorrect(password)
    if (!isPasswordValid) {
        throw new ApiError(400, "Invalid Admin Credentials!!!")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(admin._id)

    const adminData = await Admin.findById(admin._id).select("-password -refreshToken")
    
    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200, 
            {
                admin: adminData, accessToken, refreshToken
            }, 
            "Admin Logged in Successfully!!!")
    )
})

const adminLogout = asyncHandler( async (req, res) => {
    await Admin.findByIdAndUpdate(
        req.admin._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(
        new ApiResponse(200, {}, "Admin Logged out Successfully!!!")
    )
})

const getAllUsers = asyncHandler( async ( req, res) => {
    try {
        const users = await User.find().select("-refreshToken -password")
        
        return res 
        .status(200)
        .json(
            new ApiResponse(200, users, "All users details fetched successfully..")
        )
    } catch (error) {
        throw new ApiError(500, error?.message || "Something went wrong while getting all users")
    }
})

const getUserDetails = asyncHandler( async (req, res) => {
    const { id } = req.params

    try {
        const user = await User.findById(id).select("-password -refreshToken")

        if (!user) {
            throw new ApiError(404, "User not found")
        }

        const [videos, musics, likedVideos, dislikedVideo, likedMusic, dislikedMusic] = await Promise.all([
            Video.find({ userId: id }),
            Music.find({ userId: id }),
            Video.find({ _id: { $in: user.likedVideo }}),
            Video.find({ _id: { $in: user.dislikedVideo }}),
            Music.find({ _id: { $in: user.likedMusic }}),
            Music.find({ _id: { $in: user.dislikedMusic }}),
        ])

        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {
                    user: {
                        name: user.name,
                        email: user.email,
                        avatar: user.avatar,
                        createdAt: user.createdAt
                    },
                    videos,
                    musics,
                    likedVideos,
                    likedMusic,
                    dislikedVideo,
                    dislikedMusic
                },
                "Get user's all details"
            )
        )
    } catch (error) {
        throw new ApiError(500, error?.message || "Something went wrong while getting user's details")
    }
})

const deleteMedia = asyncHandler( async (req, res) => {
    const { id } = req.params
    const { type } = req.query

    try {
        if (type === 'video') {
            const deletedVideo = await Video.findByIdAndDelete(id)
            if (!deletedVideo) {
                throw new ApiError(404, "Video not found")
            }

            return res
            .status(200)
            .json(
                new ApiResponse(200, {}, "Video Deleted Successfully!!!")
            )
        } else if (type === 'music') {
            const deletedMusic = await Music.findByIdAndDelete(id)
            if (!deletedMusic) {
                throw new ApiError(404, "Music not found")
            }

            return res
            .status(200)
            .json(
                new ApiResponse(200, {}, "Music Deleted Successfully!!!")
            )
        }
    } catch (error) {
        throw new ApiError(500, error?.message || "Something went wrong while deleting media")
    }
})

export {
    adminLogin,
    adminLogout,
    getAllUsers,
    getUserDetails,
    deleteMedia
}