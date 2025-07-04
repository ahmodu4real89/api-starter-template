import express from "express";
import cors from "cors";
import "dotenv/config"
import connectDb from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
const app = express()

const PORT = process.env.PORT || 4000
connectDb();
connectCloudinary()
app.use(express.json())
app.use(cors())


app.get('/', (req, res)=>{
    return res.send({msg:" Hello World"})
})



app.listen(PORT, ()=>{
    console.log(`Server start from ${PORT}`)
})