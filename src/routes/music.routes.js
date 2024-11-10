import { Router } from "express";
import { verifyUserJWT } from "../middlewares/auth.middleware.js";
import { 
    getAllMusic,
    getMusicDetails,
    uploadMusic 
} from "../controllers/music.controller.js";

const router = Router()

router.route("/upload-music").post(verifyUserJWT, uploadMusic)
router.route("/get-all-musics").get(getAllMusic)
router.route("/get-music-details/:id").get(getMusicDetails)

export default router