import mongoose, { Schema } from "mongoose"

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: Array, required: true },
    category: { type: String, required: true },
    subCategory: { type: String },
    sizes: { type: Array, required: true },
    bestSeller: { type: Boolean,  default: false  },
    date: { type: Number, required: true }

});




const Product = mongoose.model.product || mongoose.model("product", productSchema)
export default Product