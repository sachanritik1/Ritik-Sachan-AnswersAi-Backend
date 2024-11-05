import { Router } from "express"

import { verifyJWT } from "../middlewares/auth.middleware"
import {
    getAnswerByAI,
    getQuestionsById,
} from "../controllers/question.controller"

const questionRouter = Router()

questionRouter.use(verifyJWT)
questionRouter.route("/").post(getAnswerByAI)
questionRouter.route("/:questionId").post(getQuestionsById)

export default questionRouter
