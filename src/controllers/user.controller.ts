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

    const { email, password, fullName } = registerSchema.parse(req.body)
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
        select: {
            id: true,
            email: true,
            fullName: true,
            createdAt: true,
            updatedAt: true,
        },
    })

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering user")
    }

    return res
        .status(201)
        .json(new ApiResponse(201, "User created", { createdUser }))
})

const getUserById = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.params.userId
    const user = await prisma.user.findUnique({
        where: {
            id: userId,
        },
        select: {
            id: true,
            email: true,
            fullName: true,
            createdAt: true,
            updatedAt: true,
        },
    })
    if (!user) {
        throw new ApiError(404, "User not found")
    }
    return res.status(200).json(
        new ApiResponse(200, "User found", {
            user,
        })
    )
})

const getQuestionsByUserId = asyncHandler(
    async (req: Request, res: Response) => {
        const stringToNumberSchema = z.string().transform((val) => {
            const number = parseFloat(val)
            if (isNaN(number)) {
                throw new ApiError(400, "Invalid query parameters")
            }
            return number
        })

        const queryParamsSchema = z.object({
            limit: stringToNumberSchema.default("20"),
            offset: stringToNumberSchema.default("0"),
        })

        const { limit, offset } = queryParamsSchema.parse(req.query)

        const userId = req.params.userId
        const questions = await prisma.question.findMany({
            where: {
                userId,
            },
            take: limit,
            skip: offset * limit,
        })
        return res.status(200).json(
            new ApiResponse(200, "Questions found", {
                questions,
            })
        )
    }
)

export { registerUser, getUserById, getQuestionsByUserId }
