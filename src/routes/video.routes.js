import { Router } from "express";
import { 
    dislike,
    getAllVideos,
    getdisikedVideo,
    getLikedVideo,
    getUserVideo,
    getVideoDetails,
    like,
    uploadVideo 
} from "../controllers/video.controller.js";
import { verifyUserJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/upload-video").post(verifyUserJWT, uploadVideo)
router.route("/get-all-videos").get(getAllVideos)
router.route("/get-video-details/:id").get(getVideoDetails)
router.route("/like/:videoId").patch(verifyUserJWT, like)
router.route("/dislike/:videoId").patch(verifyUserJWT, dislike)
router.route("/get-liked-video").get(verifyUserJWT, getLikedVideo)
router.route("/get-disliked-video").get(verifyUserJWT, getdisikedVideo)
router.route("/get-user-video").get(verifyUserJWT, getUserVideo)
router.route("/delete-video/:videoId").delete(verifyUserJWT, deleteVideo)

export default router