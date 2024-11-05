import asyncHandler from "../utils/asyncHandler"
import z from "zod"
import { ApiError } from "../utils/ApiError"
import { ApiResponse } from "../utils/ApiResponse"
import jwt from "jsonwebtoken"
import { NextFunction, Request, Response } from "express"
import { prisma } from "../db/db"
import {
    generateAccessTokenAndRefreshToken,
    isPasswordCorrect,
} from "../utils/auth"

const loginUser = asyncHandler(async (req: Request, res: Response) => {
    const loginSchema = z.object({
        email: z.string().email(),
        password: z.string().min(6).max(30),
    })
    const result = loginSchema.safeParse(req.body)
    if (!result.success) {
        throw new ApiError(400, "Invalid arguments", result.error)
    }
    const { email, password } = result.data

    if (!email) {
        throw new ApiError(400, "Please provide username or email")
    }
    if (!password) {
        throw new ApiError(400, "Please provide password")
    }

    const user = await prisma.user.findUnique({
        where: { email },
    })

    if (!user) {
        throw new ApiError(404, "User not found")
    }

    const isMatch = isPasswordCorrect(password, user.password)
    if (!isMatch) {
        throw new ApiError(400, "Invalid credentials")
    }

    const { accessToken, refreshToken } =
        await generateAccessTokenAndRefreshToken(user)

    //sending cookie
    const options = {
        httpOnly: true,
        secure: true,
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(200, "User logged in successfully", {
                user: {
                    id: user.id,
                    email: user.email,
                    fullName: user.fullName,
                },
                accessToken,
                refreshToken,
            })
        )
})

const logoutUser = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        await prisma.user.update({
            where: { id: req.headers["userId"] as string },
            data: {
                refreshToken: null,
                accessToken: null,
            },
        })

        const options = {
            httpOnly: true,
            secure: true,
        }
        return res
            .status(200)
            .clearCookie("accessToken", options)
            .clearCookie("refreshToken", options)
            .json(new ApiResponse(200, "User logged out successfully", {}))
    }
)

const refreshAccessToken = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const incomingRefreshToken =
            req.cookies?.refreshToken || req.body?.refreshToken
        if (!incomingRefreshToken) {
            throw new ApiError(401, "Unauthorized request")
        }

        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET || "secret"
        )
        if (!decodedToken || typeof decodedToken === "string") {
            throw new ApiError(500, "Something went wrong while decoding token")
        }

        const user = await prisma.user.findUnique(decodedToken.id)
        if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        }

        if (user.refreshToken !== incomingRefreshToken) {
            throw new ApiError(
                401,
                "Refresh token is expired or used. Please login again."
            )
        }

        const { accessToken, refreshToken } =
            await generateAccessTokenAndRefreshToken(user)

        //sending cookie
        const options = {
            httpOnly: true,
            secure: true,
        }

        res.status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                new ApiResponse(200, "Access token refreshed successfully", {
                    accessToken,
                    refreshToken,
                })
            )
    }
)

export { loginUser, logoutUser, refreshAccessToken }
