import express from "express";

import {
  createProduct,
  createProductReview,
  deleteProduct, deleteProductReview, editProductReview,
  getProductById,
  getProducts,
  getTopProducts,
  updateProduct,
} from "../controllers/productController.js";
import { isAdmin, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

//api/products
router.route('/')
    .get(getProducts)
    .post(protect, isAdmin, createProduct);
router.get('/top', getTopProducts);

router.route('/:id')
    .get(getProductById)
    .delete(protect, isAdmin, deleteProduct)
    .put(protect, isAdmin, updateProduct);

router.route('/:id/reviews')
    .post(protect, createProductReview);

router.route('/:productId/reviews/:reviewId')
    .put(protect, editProductReview)
    .delete(protect, deleteProductReview);

export default router;
