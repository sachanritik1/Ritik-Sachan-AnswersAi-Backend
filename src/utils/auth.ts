import { User } from "@prisma/client"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { prisma } from "../clients/prisma"
import { ApiError } from "./ApiError"

export async function getHashedPassword(password: string) {
    return await bcrypt.hash(password, 10)
}

export async function isPasswordCorrect(
    password: string,
    hashedPassword: string
) {
    return await bcrypt.compare(password, hashedPassword)
}

export function generateAccessToken(user: User) {
    return jwt.sign(
        {
            id: user.id,
            email: user.email,
            fullName: user.fullName,
        },
        process.env.ACCESS_TOKEN_SECRET || "1234",
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "1D",
        }
    )
}

export function generateRefreshToken(user: User) {
    return jwt.sign(
        { id: user.id },
        process.env.REFRESH_TOKEN_SECRET || "1234",
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "30D",
        }
    )
}

export const generateAccessTokenAndRefreshToken = async (user: User) => {
    try {
        const accessToken = generateAccessToken(user)
        const refreshToken = generateRefreshToken(user)
        await prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                refreshToken,
                accessToken,
            },
        })
        return { accessToken, refreshToken }
    } catch (err) {
        throw new ApiError(500, "Something went wrong while generating tokens")
    }
}
