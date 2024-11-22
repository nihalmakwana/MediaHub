import Router from 'express'
import { verifyUserJWT } from '../middlewares/auth.middleware.js'
import { 
    createPlaylist,
    getUserAllPLaylist,
    getUserPlaylist,
    saveToPlaylist 
} from '../controllers/playlist.controller.js'

const router = Router()

router.route("/save-to-playlist").post(verifyUserJWT, saveToPlaylist)
router.route("/get-user-playlist").get(verifyUserJWT, getUserPlaylist)
router.route("/create-playlist").post(verifyUserJWT, createPlaylist)
router.route("/get-user-all-playlist").get(verifyUserJWT, getUserAllPLaylist)

export default router