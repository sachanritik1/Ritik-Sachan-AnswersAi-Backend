import asyncHandler from "../utils/asyncHandler"
import z from "zod"
import { ApiError } from "../utils/ApiError"
import { ApiResponse } from "../utils/ApiResponse"
import { Request, Response } from "express"
import { prisma } from "../clients/prisma"
import llm from "../clients/langchain"

const getAnswerByAI = asyncHandler(async (req: Request, res: Response) => {
    const questionSchema = z.object({
        question: z.string().min(3),
    })

    const result = questionSchema.safeParse(req.body)

    if (!result.success) {
        throw new ApiError(400, "Invalid arguments", result.error)
    }

    const { question } = result.data

    const completion = await llm.invoke(question)

    const answer = completion.trim()

    if (!answer) {
        throw new ApiError(400, "AI Failed to generate answer")
    }

    const Question = await prisma.question.create({
        data: {
            userId: req.headers["userId"] as string,
            questionString: question,
            answerString: answer,
        },
    })

    return res
        .status(200)
        .json(new ApiResponse(200, "Answer Generated", { question: Question }))
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
