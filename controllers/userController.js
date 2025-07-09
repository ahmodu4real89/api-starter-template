import User from "../models/userModel.js"
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"


const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET)
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email })
        if (!user) {
            res.json({ success: false, message: "User doesn't exist" })
        }

        const comparePassword = await bcrypt.compare(password, user.password)
        if (comparePassword) {
            const token = createToken(user._id)
            res.json({ success: true, token })
        } else {
            res.json({ success: false, message: "Invalid credential" })
        }
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

const userRegister = async (req, res) => {
    try {
        const { name, email, password } = req.body

        const emailExist = await User.findOne({ email })
        if (emailExist) {
            res.json({ success: false, message: "User alrerady exist" })
        };

        if (!validator.isEmail(email)) {
            res.json({ success: false, message: "Please enter valid email" })
        };

        if (password.length < 8) {
            res.json({ success: false, message: "Please enter password up to 8 character" })
        };

        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt)
        const newUser = new User({ name, email, password: hashPassword });
        const savedUser = await newUser.save();

        const token = createToken(savedUser._id)
        res.json({ success: true, token })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })

    }
}

const adminLogin = async (req, res) => {
    try {

        const { email, password } = req.body
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign({email}, process.env.JWT_SECRET,  { expiresIn: "1h" })
            res.json({ success: true, token })
        }else{
             res.json({ success: false, message:"Invalid credentiial" })
        }
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}


export { loginUser, userRegister, adminLogin }