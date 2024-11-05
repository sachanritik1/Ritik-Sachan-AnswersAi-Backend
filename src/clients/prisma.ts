import { PrismaClient } from "@prisma/client"

export const prisma = new PrismaClient()

const connectDB = async () => {
    try {
        await prisma.$connect()
        console.log(`Database connected !!`)
    } catch (err) {
        console.log("Database connection failed " + err)
        await prisma.$disconnect()
        process.exit(1)
    }
}
export default connectDB
