import mongoose, { Schema } from "mongoose"

const userSchema = new mongoose.Schema({
    name:{type:String, required:true},
    email:{type:String, required:true, unique:true},
    password:{type:String, required:true},
    cartData:{type:Object, default:{}}

}, {minimize:false})

const User = mongoose.model.user || mongoose.model("user", userSchema)
export default User