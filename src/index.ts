import "dotenv/config"
import connectDB from "./clients/prisma"
const PORT: string = process.env.PORT || "5000"
import cookieParser from "cookie-parser"
import cors from "cors"
import express from "express"
import mainRouter from "./routes"

const app = express()

;(async () => {
    try {
        await connectDB()
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
    } catch (err) {
        console.log("SERVER RUN FAILED " + err)
        process.exit(1)
    }
})()

app.use(
    cors({
        origin: process.env.CLIENT_BASE_URL,
        credentials: true,
    })
)

app.use(express.json({ limit: "20kb" }))
app.use(express.urlencoded({ extended: true, limit: "20kb" }))
app.use(express.static("public"))
app.use(cookieParser())

//use routes
app.use("/api", mainRouter)
