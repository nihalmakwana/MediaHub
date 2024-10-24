import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Video } from "../models/video.model.js";

const uploadVideo = asyncHandler ( async (req, res) => {
    
    
    return res
    .status(200)
    .json(
        new ApiResponse(200, {}, "Video Uploaded Successfully!!!")
    )
})

export {
    uploadVideo
}