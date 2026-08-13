import express from "express";
import {
  getAllUsers,
  deleteUser,
  dashboardStats,
  getAllOrders,
  getSingleOrder,
  updateOrderStatus,
  getAdminProfile,
  updateAdminProfile,
  updateAdminPassword,
} from "../controllers/adminController.js";

import {
  authorizedRoles,
  isAuthenticated,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get(
  "/getallusers",
  isAuthenticated,
  authorizedRoles("Admin"),
  getAllUsers
);

router.delete(
  "/delete/:id",
  isAuthenticated,
  authorizedRoles("Admin"),
  deleteUser
);

router.get(
  "/fetch/dashboard-stats",
  isAuthenticated,
  authorizedRoles("Admin"),
  dashboardStats
);
router.get(
  "/profile",
  isAuthenticated,
  authorizedRoles("Admin"),
  getAdminProfile
);

router.put(
  "/profile/update",
  isAuthenticated,
  authorizedRoles("Admin"),
  updateAdminProfile
);

router.put(
  "/profile/password",
  isAuthenticated,
  authorizedRoles("Admin"),
  updateAdminPassword
);
// Orders
router.get(
  "/orders",
  isAuthenticated,
  authorizedRoles("Admin"),
  getAllOrders
);

router.get(
  "/orders/:id",
  isAuthenticated,
  authorizedRoles("Admin"),
  getSingleOrder
);

router.put(
  "/orders/:id",
  isAuthenticated,
  authorizedRoles("Admin"),
  updateOrderStatus
);

export default router;