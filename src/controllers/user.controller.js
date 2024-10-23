import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"

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

export {
    registerUser
}