import { PrismaClient } from "@prisma/client"

export const prisma = new PrismaClient()

const connectDB = async () => {
    try {
        const dbInstance = await prisma.$connect()
        console.log(`MongoDB connected to host: ${dbInstance}`)
    } catch (err) {
        console.log("MONGODB CONNECTION FAILED " + err)
        await prisma.$disconnect()
        process.exit(1)
    }
}
export default connectDB
