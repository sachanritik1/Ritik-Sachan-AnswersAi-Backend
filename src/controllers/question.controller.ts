import asyncHandler from "../utils/asyncHandler"
import z from "zod"
import { ApiError } from "../utils/ApiError"
import { ApiResponse } from "../utils/ApiResponse"
import { Request, Response } from "express"
import { prisma } from "../db/db"

const getAnswerByAI = asyncHandler(async (req: Request, res: Response) => {
    const questionSchema = z.object({
        question: z.string().min(3),
    })

    const result = questionSchema.safeParse(req.body)

    if (!result.success) {
        throw new ApiError(400, "Invalid arguments", result.error)
    }

    const { question } = result.data

    //  find answer from AI
    //  make entry in database
    //  return answer

    return res
        .status(200)
        .json(new ApiResponse(200, "Answer found", { answer: "" }))
})

const getQuestionsById = asyncHandler(async (req: Request, res: Response) => {
    const { questionId } = req.params

    const question = await prisma.question.findUnique({
        where: { id: questionId },
    })

    if (!question) {
        throw new ApiError(404, "Question not found")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, "Question found", { question }))
})

export { getAnswerByAI, getQuestionsById }
