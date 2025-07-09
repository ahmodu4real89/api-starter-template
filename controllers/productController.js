import mongoose from "mongoose";
import Product from "../models/productModel.js"
import { v2 as cloudinary } from "cloudinary"
const addProduct = async (req, res) => {
    try {
        const { name, description, price, image, category, subCategory, sizes, bestSeller, date } = req.body
        const image1 = req.files.image1 && req.files.image1[0]
        const image2 = req.files.image2 && req.files.image2[0]
        const image3 = req.files.image3 && req.files.image3[0]
        const image4 = req.files.image4 && req.files.image4[0]
        const images = [image1, image2, image3, image4].filter((item) => item !== undefined)
        const imagesUrl = await Promise.all(
            images.map(async (item) => {
                let result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' })
                return result.secure_url
            })
        )

        const productData = {
            name,
            description,
            price: Number(price),
            image: imagesUrl,
            
            category,
            subCategory,
            sizes: JSON.parse(sizes),
            bestSeller,
            date: Date.now()
        }

        const product = new Product(productData)
        const newProduct = await product.save()

        res.json({ success: true, newProduct })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}


const listProducts = async (req, res) => {
    try {
        const product = await Product.find({})
        res.json({ success: true, product })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}


const singleProduct = async (req, res) => {
    try {
        const { product_id } = req.body;
        const product = await Product.findById(product_id);

        if (!product) {
            return res.json({ success: false, message: "Product not found" });
        }

        res.json({ success: true, product });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};



const updateProduct = async (req, res) => {
    try {
        const { product_id } = req.body;

        // Validate ObjectId format
        if (!mongoose.isValidObjectId(product_id)) {
            return res.json({
                success: false,
                message: "Invalid product ID format"
            });
        }

        // Build update object dynamically
        const updateData = {};
        const fields = [
            "name", "description", "price",
            "category", "subCategory", "sizes",
            "bestSeller", "image"
        ];

        for (let field of fields) {
            if (req.body[field] !== undefined) {
                if (field === "price") {
                    updateData.price = Number(req.body.price);
                } else if (field === "sizes") {
                    if (Array.isArray(req.body.sizes)) {
                        updateData.sizes = req.body.sizes;
                    } else if (typeof req.body.sizes === "string") {
                        updateData.sizes = req.body.sizes.startsWith("[")
                            ? JSON.parse(req.body.sizes)
                            : req.body.sizes.split(",").map(s => s.trim());
                    }
                } else if (field === "bestSeller") {
                    updateData.bestSeller = ["true", "1", "yes"].includes(
                        String(req.body.bestSeller).toLowerCase()
                    );
                } else {
                    updateData[field] = req.body[field];
                }
            }
        }

        // Also handle uploaded images if any
        if (req.felseiles) {
            const images = [
                req.files?.image1?.[0]?.path,
                req.files?.image2?.[0]?.path,
                req.files?.image3?.[0]?.path,
                req.files?.image4?.[0]?.path
            ].filter(Boolean);
            if (images.length) updateData.image = images;
        }

        const product = await Product.findByIdAndUpdate(
            product_id,
            { $set: updateData },
            { new: true }
        );

        if (!product) {
            return res.json({
                success: false,
                message: "Product not found"
            });
        }

        res.json({
            success: true,
            message: "Product updated successfully",
            product
        });

    } catch (error) {
        console.error(error);
        res.json({
            success: false,
            message: "Server error. Please try again."
        });
    }
};




const deleteProduct = async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.body.id)
        res.json({ success: true, message: "Product Removed" })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}


export { addProduct, listProducts, deleteProduct, singleProduct, updateProduct }