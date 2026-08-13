import express from "express";

import {
  addAddress,
  getAddresses,
  deleteAddress,
  setDefaultAddress,
  updateAddress,
} from "../controllers/addressController.js";

import { isAuthenticated } from "../middlewares/authMiddleware.js";

const router = express.Router();

// All routes require login
router.use(isAuthenticated);

// Get all addresses
router.get("/", getAddresses);

// Add new address
router.post("/add", addAddress);

// Delete address
router.delete("/:id", deleteAddress);
router.put("/:id", updateAddress);

// Set default address
router.put("/default/:id", setDefaultAddress);


export default router;