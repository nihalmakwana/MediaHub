import { Router } from "express";
import { 
    adminLogin, 
    adminLogout,
    deleteMedia,
    getAllUsers,
    getUserDetails
} from "../controllers/admin.controller.js";
import { verifyAdminJWT } from "../middlewares/auth.middleware.js";


const router = Router()

router.route("/admin-login").post(adminLogin)
router.route("/admin-logout").post(verifyAdminJWT, adminLogout)

router.route("/get-all-users").get(verifyAdminJWT, getAllUsers)
router.route("/get-users-details/:id").get(verifyAdminJWT, getUserDetails)
router.route("/media/:id").delete(verifyAdminJWT, deleteMedia)

export default router