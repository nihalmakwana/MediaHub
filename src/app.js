import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))
app.use(cookieParser())

// Import routes
import userRouter from "./routes/user.routes.js"
import adminRouter from "./routes/admin.routes.js"
import videoRouter from "./routes/video.routes.js"
import musicRouter from "./routes/music.routes.js"

// Routes Declaration
app.use("/api/v1/user", userRouter)
app.use("/api/v1/admin", adminRouter)
app.use("/api/v1/video", videoRouter)
app.use("/api/v1/music", musicRouter)

export { app }