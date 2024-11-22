import { Router } from "express";
import { verifyUserJWT } from "../middlewares/auth.middleware.js";
import { 
    dislike,
    getAllMusic,
    getDislikedMusic,
    getLikedMusic,
    getMusicDetails,
    getUserMusic,
    like,
    uploadMusic 
} from "../controllers/music.controller.js";

const router = Router()

router.route("/upload-music").post(verifyUserJWT, uploadMusic)
router.route("/get-all-musics").get(getAllMusic)
router.route("/get-music-details/:id").get(getMusicDetails)
router.route("/like/:musicId").patch(verifyUserJWT, like)
router.route("/dislike/:musicId").patch(verifyUserJWT, dislike)
router.route("/get-liked-music").get(verifyUserJWT, getLikedMusic)
router.route("/get-disliked-music").get(verifyUserJWT, getDislikedMusic)
router.route("/get-user-music").get(verifyUserJWT, getUserMusic)

export default router