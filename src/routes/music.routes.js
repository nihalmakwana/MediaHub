import { Router } from "express";
import { verifyUserJWT } from "../middlewares/auth.middleware.js";
import { 
    getAllMusic,
    uploadMusic 
} from "../controllers/music.controller.js";

const router = Router()

router.route("/upload-music").post(verifyUserJWT, uploadMusic)
router.route("/get-all-musics").get(getAllMusic)

export default router