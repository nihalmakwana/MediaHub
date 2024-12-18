import { Router } from "express";
import { verifyUserJWT } from "../middlewares/auth.middleware.js";
import { 
    deleteMusic,
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
router.route("/like/:musicId").post(verifyUserJWT, like)
router.route("/dislike/:musicId").post(verifyUserJWT, dislike)
router.route("/get-liked-music").get(verifyUserJWT, getLikedMusic)
router.route("/get-disliked-music").get(verifyUserJWT, getDislikedMusic)
router.route("/get-user-music").get(verifyUserJWT, getUserMusic)
router.route("/delete-music/:musicId").delete(verifyUserJWT, deleteMusic)

export default router