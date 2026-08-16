import express from "express";

import {
  createProduct,
  fetchAllProducts,
  updateProduct,
  deleteProduct,
  fetchSingleProduct,
  postProductReview,
  deleteReview,
  fetchAIFilteredProducts,
} from "../controllers/productController.js";

import {
  authorizedRoles,
  isAuthenticated,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

// ============================
// PUBLIC PRODUCT ROUTES
// ============================

// Get all products
// GET /api/v1/product
router.get("/", fetchAllProducts);

// Get single product
// GET /api/v1/product/singleProduct/:productId
router.get("/singleProduct/:productId", fetchSingleProduct);

// ============================
// REVIEW ROUTES
// ============================

// Post product review
router.put(
  "/post-new/review/:productId",
  isAuthenticated,
  postProductReview
);

// Delete product review
router.delete(
  "/delete/review/:productId",
  isAuthenticated,
  deleteReview
);

// ============================
// ADMIN PRODUCT ROUTES
// ============================

// Create product
router.post(
  "/admin/create",
  isAuthenticated,
  authorizedRoles("Admin"),
  createProduct
);

// Update product
router.put(
  "/admin/update/:productId",
  isAuthenticated,
  authorizedRoles("Admin"),
  updateProduct
);

// Delete product
router.delete(
  "/admin/delete/:productId",
  isAuthenticated,
  authorizedRoles("Admin"),
  deleteProduct
);

// ============================
// AI PRODUCT SEARCH
// ============================

router.post(
  "/ai-search",
  isAuthenticated,
  fetchAIFilteredProducts
);

export default router;