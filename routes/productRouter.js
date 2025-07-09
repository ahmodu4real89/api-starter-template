import express from "express"
import { addProduct, listProducts, deleteProduct, singleProduct, updateProduct  } from "../controllers/productController.js"
import upload from "../middleware/multer.js";
import adminAuth from "../middleware/adminAuth.js";

const productRouter = express.Router()

productRouter.post(
    '/add',adminAuth,
    upload.fields([
        { name: 'image1', maxCount: 1 },
        { name: 'image2', maxCount: 1 },
        { name: 'image3', maxCount: 1 },
        { name: 'image4', maxCount: 1 }
    ]),
    addProduct
);
productRouter.get("/lists",  listProducts )
productRouter.post("/list", singleProduct  )
productRouter.post("/update", updateProduct)
productRouter.delete("/remove",adminAuth, deleteProduct)

export default productRouter;