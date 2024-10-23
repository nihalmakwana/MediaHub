import { Router } from "express";
import { 
    adminLogin, 
    adminLogout
} from "../controllers/admin.controller.js";
import { verifyAdminJWT } from "../middlewares/auth.middleware.js";


const router = Router()

router.route("/admin-login").post(adminLogin)
router.route("/admin-logout").post(verifyAdminJWT, adminLogout)

export default router