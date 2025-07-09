import express from "express";
import cors from "cors";
import "dotenv/config"
import connectDb from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRouter.js";
const app = express()

const PORT = process.env.PORT || 4000
connectDb();
connectCloudinary()
app.use(express.json())
app.use(cors())
app.use(express.urlencoded({ extended: true }))

app.use("/api/user", userRouter)
app.use("/api/product", productRouter)



app.listen(PORT, ()=>{
    console.log(`Server start from ${PORT}`)
})