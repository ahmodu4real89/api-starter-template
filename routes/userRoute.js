import express from "express"
import { loginUser, adminLogin, userRegister } from "../controllers/userController.js"

const userRouter = express.Router()


userRouter.post('/register', userRegister) 
userRouter.post("/login", loginUser)
userRouter.post("/admin", adminLogin)

export default userRouter;