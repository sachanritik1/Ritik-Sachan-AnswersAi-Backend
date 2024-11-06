import request from "supertest"
import app from "../src/index" // Path to your Express app
import { prisma } from "../src/clients/prisma" // Path to Prisma client

jest.mock("../src/clients/prisma", () => ({
    prisma: {
        user: {
            create: jest.fn(),
            findUnique: jest.fn(),
        },
        question: {
            findMany: jest.fn(),
        },
        $connect: jest.fn(),
        $disconnect: jest.fn(),
    },
}))

const mockUser = {
    id: "1",
    email: "test@example.com",
    password: "password123",
    fullName: "Test User",
    createdAt: new Date(),
    updatedAt: new Date(),
}

describe("User Routes", () => {
    afterEach(() => {
        jest.clearAllMocks() // Clear mocks between tests
    })

    describe("POST /api/users", () => {
        it("should register a new user successfully", async () => {
            // Mock Prisma response
            ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(null)
            ;(prisma.user.create as jest.Mock).mockResolvedValue(mockUser)

            const response = await request(app).post("/api/users").send({
                email: mockUser.email,
                password: mockUser.password,
                fullName: mockUser.fullName,
            })

            expect(response.status).toBe(201)
            expect(response.body.data.createdUser.email).toBe(mockUser.email)
            expect(prisma.user.create).toHaveBeenCalledTimes(1)
        })

        it("should return 409 if user already exists", async () => {
            ;(prisma.user.findUnique as jest.Mock).mockResolvedValueOnce({
                id: "1",
            }) // Mock existing user

            const response = await request(app).post("/api/users").send({
                email: mockUser.email,
                password: mockUser.password,
                fullName: mockUser.fullName,
            })

            expect(response.status).toBe(409)
            expect(response.body.message).toBe("User already exists")
            expect(prisma.user.findUnique).toHaveBeenCalledTimes(1)
        })
    })
})
