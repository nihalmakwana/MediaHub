import { Router } from "express";
import { 
    getAllVideos,
    uploadVideo 
} from "../controllers/video.controller.js";
import { verifyUserJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/upload-video").post(verifyUserJWT, uploadVideo)
router.route("/get-all-videos").get(getAllVideos)

export default router