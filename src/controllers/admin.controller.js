import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Admin } from "../models/admin.model.js"

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

export {
    adminLogin,
    adminLogout
}