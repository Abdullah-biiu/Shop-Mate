import { createUserTable } from "../models/userTable.js";
import { createProductsTable } from "../models/productTable.js";
import { createProductReviewsTable } from "../models/productReviewsTable.js";
import { createOrdersTable } from "../models/ordersTable.js";
import { createOrderItemTable } from "../models/orderItemsTable.js";
import { createShippingInfoTable } from "../models/shippingInfoTable.js";
import { createPaymentsTable } from "../models/paymentsTable.js";
import { createAddressesTable } from "../database/tables/addressTable.js"; // <-- ADD THIS

export const createTables = async () => {
  try {
    await createUserTable();
    await createProductsTable();
    await createProductReviewsTable();
    await createOrdersTable();
    await createOrderItemTable();
    await createShippingInfoTable();
    await createPaymentsTable();
    await createAddressesTable(); // <-- ADD await

    console.log("✅ All Tables Created Successfully.");
  } catch (error) {
    console.error("Error creating tables:", error);
  }
};