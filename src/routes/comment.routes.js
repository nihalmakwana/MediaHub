import Router from 'express'
import { addComment, getComment } from '../controllers/comment.controller.js'
import { verifyUserJWT } from "../middlewares/auth.middleware.js"

const router = Router()

router.route("/add-comment").post(verifyUserJWT, addComment)
router.route("/get-comment/:id").get(getComment)

export default router