import { Router } from "express"
import authRouter from "./auth.route"
import userRouter from "./user.route"
import questionRouter from "./question.route"

const router = Router()

router.use("/auth", authRouter)
router.use("/users", userRouter)
router.use("/questions", questionRouter)

export default router
