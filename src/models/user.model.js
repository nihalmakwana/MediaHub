import mongoose, { Schema } from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        }, 
        password: {
            type: String,
            required: true
        },
        avatar: {
            type: String,
            required: true
        },
        refreshToken: {
            type: String
        },
        likedVideo: {
            type: [Schema.Types.ObjectId],
            ref: "Video",
            default: []
        },
        dislikedVideo: {
            type: [Schema.Types.ObjectId],
            ref: "Video",
            default: []
        },
        likedMusic: {
            type: [Schema.Types.ObjectId],
            ref: "Music",
            default: []
        },
        dislikedMusic: {
            type: [Schema.Types.ObjectId],
            ref: "Music",
            default: []
        }
    },
    { timestamps: true }
)

// Method to encrypt the password
userSchema.pre("save", async function(next) {
    if(!this.isModified("password")) return next()

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

// Method to check encrypted password 
userSchema.methods.isPasswordCorrect = async function(password) {
    return await bcrypt.compare(password, this.password)
}

// Method to generate access token
userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            name: this.name
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

// Methos to generate refresh token
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema)
