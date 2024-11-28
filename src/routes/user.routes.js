import { Router } from "express";
import { 
    getNews,
    loginUser,
    logoutUser,
    registerUser, 
    searchMedia
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyUserJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/register").post(
    upload.single("avatar"),
    registerUser
)

router.route("/user-login").post(loginUser)
router.route("/user-logout").post(verifyUserJWT,logoutUser)
router.route("/search").get(searchMedia)
router.route("/get-news").get(getNews)

export default router