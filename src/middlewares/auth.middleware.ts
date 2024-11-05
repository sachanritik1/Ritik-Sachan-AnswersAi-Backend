import asyncHandler from "../utils/asyncHandler"
import { ApiError } from "../utils/ApiError"
import { NextFunction, Request } from "express"
import jwt from "jsonwebtoken"
import { Response } from "express"
import { prisma } from "../db/db"

export const verifyJWT = asyncHandler(
    async (req: Request, _: Response, next: NextFunction) => {
        try {
            const token =
                req?.cookies?.accessToken ||
                req?.headers?.authorization?.split(" ")[1]
            console.log(token)

            if (!token) {
                throw new ApiError(404, "Unauthorized request")
            }

            const decodedToken = jwt.verify(
                token,
                process.env.ACCESS_TOKEN_SECRET || "secret"
            )

            if (!decodedToken || typeof decodedToken === "string") {
                throw new ApiError(
                    500,
                    "Something went wrong while decoding token"
                )
            }

            const user = await prisma.user.findUnique({
                where: { id: decodedToken.id },
                select: { id: true },
            })
            if (!user) {
                throw new ApiError(401, "Invalid access token")
            }
            req.headers["userId"] = user.id
            next()
        } catch (error) {
            throw new ApiError(401, "Invalid access token")
        }
    }
)
