import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Admin } from "../models/admin.model.js"

const adminLogin = asyncHandler( async (req, res) => {
    return res
    .status(200)
    .json(
        new ApiResponse(200, {}, "Api Run Successfully!!!")
    )
})

export {
    adminLogin
}