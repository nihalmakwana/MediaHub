import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { ApiError } from '../utils/ApiError.js'
import { Comment } from '../models/comment.model.js'

const addComment = asyncHandler( async (req, res) => {
    const { description, videoId } = req.body
    const { _id } = req.user._id

    try {
        const newComment = await Comment.create({
            userId: _id,
            videoId,
            description
        })

        return res
        .status(200)
        .json(
            new ApiResponse(200, {newComment}, "Radhe Krishna")
        )
    } catch (error) {
        throw new ApiError(500, error?.message || "Something went wrong while add comment")
    }
})

const getComment = asyncHandler( async (req, res) => {
    const { id } = req.params

    try {
        const comments = await Comment.find({ videoId: id }).populate("userId", "name avatar")

        return res
        .status(200)
        .json(
            new ApiResponse(200, comments, "All comments fetch successfully!!!")
        )
    } catch (error) {
        throw new ApiError(500, "Something went wrong while fetching all comment")
    }
})

export {
    addComment,
    getComment
}