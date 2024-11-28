import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { Video } from "../models/video.model.js"
import { Music } from "../models/music.model.js"
import axios from 'axios'

const generateAccessTokenAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating tokens")
    }
}

const options = {
    httpOnly: true,
    secure: true
}

const registerUser = asyncHandler( async (req, res) => {

    const { name, email, password } = req.body

    if (!name || !email || !password) {
        throw new ApiError(400, "All fields are required")
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
        throw new ApiError(409, "User with email already exists!!")
    }

    const avatarLocalPath = req.file?.path
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required!!")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    if (!avatar) {
        throw new ApiError(400, "Avatar file is required...")
    }

    const user = await User.create({
        name,
        email,
        password,
        avatar: avatar.url  
    })

    const createdUser = await User.findById(user._id).select("-password -refreshToken")

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while creating user!!!")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, createdUser, "User registered successfully!!!")
    )
})

const loginUser = asyncHandler( async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        throw new ApiError(400, "All fields are required!!!")
    }

    const user = await User.findOne({ email })
    if (!user) {
        throw new ApiError(400, "User does not exits!!!")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)
    if (!isPasswordValid) {
        throw new ApiError(400, "Invalid user credentials!!!")
    }

    const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(user._id)
    
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged in successfully!!!"
        )
    )

})

const logoutUser = asyncHandler( async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
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
        new ApiResponse(200, {}, "User logged out!!!")
    )
})

const searchMedia = asyncHandler( async (req, res) => {
    const { query } = req.query

    try {
        const videos = await Video.find({ title: new RegExp(query, 'i') })
        const musics = await Music.find({ songName: new RegExp(query, 'i') })

        return res 
        .status(200)
        .json(
            new ApiResponse(200, {videos, musics}, "All results fetched successfully")
        )
    } catch (error) {
        throw new ApiError(500, error?.message || "Something went wrong while searching results")
    }
})

const getNews = asyncHandler( async (req, res) => {
    const { category } = req.query

    try {
        const response = await axios.get('https://newsapi.org/v2/top-headlines', {
            params: {
                category: category || 'general',
                apiKey: process.env.NEWS_API_KEY
            },
        })

        return res
        .status(200)
        .json(
            new ApiResponse(200, response.data, "News Fetched successfully!!!")
        )
    } catch (error) {
        throw new ApiError(500, error?.message || "Failed to get news")
    }
})

export {
    registerUser,
    loginUser,
    logoutUser,
    searchMedia,
    getNews
}