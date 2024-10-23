import { Router } from "express";
import { 
    adminLogin 
} from "../controllers/admin.controller.js";


const router = Router()

router.route("/admin-login").get(adminLogin)

export default router