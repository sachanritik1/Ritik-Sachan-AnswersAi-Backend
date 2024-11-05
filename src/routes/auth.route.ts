import { Router } from "express"
import {
    loginUser,
    logoutUser,
    refreshAccessToken,
} from "../controllers/auth.controller"
import { verifyJWT } from "../middlewares/auth.middleware"

const authRouter = Router()

authRouter.route("/login").post(loginUser)
authRouter.route("/refresh-token").post(refreshAccessToken)

//securing routes
authRouter.use(verifyJWT)
//secured routes
authRouter.route("/logout").get(logoutUser)

export default authRouter
