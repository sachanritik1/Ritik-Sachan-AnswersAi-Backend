import asyncHandler from "../utils/asyncHandler"
import z from "zod"
import { ApiError } from "../utils/ApiError"
import { ApiResponse } from "../utils/ApiResponse"
import { prisma } from "../clients/prisma"
import { getHashedPassword } from "../utils/auth"
import { Request, Response } from "express"

const registerUser = asyncHandler(async (req: Request, res: Response) => {
    const registerSchema = z.object({
        email: z.string().email(),
        password: z.string().min(6).max(30),
        fullName: z.string().min(3).max(30),
    })
    const result = registerSchema.safeParse(req.body)
    if (!result.success) {
        throw new ApiError(400, "Invalid arguments", result.error)
    }
    const { email, password, fullName } = result.data
    const existedUser = await prisma.user.findUnique({
        where: {
            email,
        },
    })
    if (existedUser) {
        throw new ApiError(409, "User already exists")
    }

    const hashedPassword = await getHashedPassword(password)

    const createdUser = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            fullName,
        },
    })

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering user")
    }

    return res.status(200).json(
        new ApiResponse(201, "User created", {
            id: createdUser.id,
            email: createdUser.email,
            fullName: createdUser.fullName,
        })
    )
})

const getUserById = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.params.userId
    const user = await prisma.user.findUnique({
        where: {
            id: userId,
        },
    })
    if (!user) {
        throw new ApiError(404, "User not found")
    }
    return res.status(200).json(
        new ApiResponse(200, "User found", {
            id: user.id,
            email: user.email,
            fullName: user.fullName,
        })
    )
})

const getQuestionsByUserId = asyncHandler(
    async (req: Request, res: Response) => {
        const userId = req.params.userId
        const questions = await prisma.question.findMany({
            where: {
                userId,
            },
        })
        return res.status(200).json(
            new ApiResponse(200, "Questions found", {
                questions,
            })
        )
    }
)

export { registerUser, getUserById, getQuestionsByUserId }
