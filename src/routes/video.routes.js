import { Router } from "express";
import { 
    uploadVideo 
} from "../controllers/video.controller.js";

const router = Router()

router.route("/upload-video").get(uploadVideo)

export default router