import { Router } from "express"

import { verifyJWT } from "../middlewares/auth.middleware"
import {
    getQuestionsByUserId,
    getUserById,
    registerUser,
} from "../controllers/user.controller"

const userRouter = Router()

userRouter.use(verifyJWT)
userRouter.route("/").post(registerUser)
userRouter.route("/:userId").get(getUserById)
userRouter.route("/:userId/questions").post(getQuestionsByUserId)

export default userRouter
