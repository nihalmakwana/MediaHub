import { Router } from "express";
import { 
    loginUser,
    logoutUser,
    registerUser 
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

export default router