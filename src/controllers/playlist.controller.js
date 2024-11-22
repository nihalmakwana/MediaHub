import { Playlist } from "../models/playlist.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.model.js"
import { Music } from "../models/music.model.js"

const saveToPlaylist = asyncHandler( async (req, res) => {
    const { playlistId, itemId, type } = req.body

    try {
        const playlist = await Playlist.findById(playlistId)

        if (!playlist) {
            throw new ApiError(404, "Playlist not found")
        }

        const itemExists = playlist.items.some(
            (item) => item.itemId.toString() === itemId && item.type === type
        )

        if (itemExists) {
            return res
            .status(200)
            .json(
                new ApiResponse(200, itemExists, "Item Already Exists")
            )
        }

        playlist.items.push({ itemId, type })
        await playlist.save()

        return res
        .status(200)
        .json(
            new ApiResponse(200, playlist, "Item Added to Playlist")
        )
    } catch (error) {
        throw new ApiError(500, error?.message || "Something went wrong while save to playlist")
    }
})

const getUserPlaylist = asyncHandler( async (req, res) => {
    try {
        const userId = req.user._id
        const playlist = await Playlist.find({ userId })

        return res
        .status(200)
        .json(
            new ApiResponse(200, playlist, "Playlist Fetch Successfully")
        )
    } catch (error) {
        throw new ApiError(500, error?.message || "Something went wrong while getting playlist")
    }
})

const createPlaylist = asyncHandler( async (req, res) => {
    const { name } = req.body
    const userId = req.user._id

    try {
        const newPlaylist = new Playlist({
            name,
            userId,
            items: []
        })

        await newPlaylist.save()

        return res
        .status(200)
        .json(
            new ApiResponse(200, newPlaylist, "Playlist Created Successfully")
        )
    } catch (error) {
        throw new ApiError(500, "Something went wrong while creating playlist")
    }
})

const getUserAllPLaylist = asyncHandler( async (req, res) => {
    try {
        const userId = req.user._id
        const playlists = await Playlist.find({ userId })
        
        const enrichedPlaylists = await Promise.all(
            playlists.map(async (playlist) => {
                const itemsWithDetails = await Promise.all(
                    playlist.items.map(async (item) => {
                        if (item.type === "video") {
                            const video = await Video.findById(item.itemId).select("title desc imageUrl");
                            return { ...item.toObject(), details: video };
                        } else if (item.type === "music") {
                            const music = await Music.findById(item.itemId).select("singerName songName desc image");
                            return { ...item.toObject(), details: music };
                        }
                        return item; // Fallback if type doesn't match
                    })
                );

                return { ...playlist.toObject(), items: itemsWithDetails };
            })
        );

        return res
        .status(200)
        .json(
            new ApiResponse(200, enrichedPlaylists, "Playlist Fetch Successfully")
        )
    } catch (error) {
        throw new ApiError(500, error?.message || "Something went wrong while getting playlist details")
    }
})

export {
    saveToPlaylist,
    getUserPlaylist,
    createPlaylist,
    getUserAllPLaylist
}