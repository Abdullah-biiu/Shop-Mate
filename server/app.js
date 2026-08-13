import express from "express";
import { config } from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import Stripe from "stripe";

import database from "./database/db.js";
import { createTables } from "./utils/createTables.js";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";

// Routes
import authRouter from "./router/authRoutes.js";
import productRouter from "./router/productRoutes.js";
import adminRouter from "./router/adminRoutes.js";
import orderRouter from "./router/orderRoutes.js";
import addressRouter from "./router/addressRoutes.js";

// Load Environment Variables
config({ path: "./config/config.env" });

const app = express();

// ============================
// CORS
// ============================

app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL,
      process.env.DASHBOARD_URL,
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// ============================
// Stripe Webhook
// ============================

app.post(
  "/api/v1/payment/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];

    let event;

    try {
      event = Stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (error) {
      return res
        .status(400)
        .send(`Webhook Error: ${error.message}`);
    }

    if (event.type === "payment_intent.succeeded") {
      try {
        const paymentIntent =
          event.data.object.client_secret;

        const payment = await database.query(
          `UPDATE payments
           SET payment_status='Paid'
           WHERE payment_intent_id=$1
           RETURNING *`,
          [paymentIntent]
        );

        if (payment.rows.length > 0) {
          const orderId = payment.rows[0].order_id;

          await database.query(
            `UPDATE orders
             SET paid_at = NOW()
             WHERE id=$1`,
            [orderId]
          );

          const items = await database.query(
            `SELECT product_id, quantity
             FROM order_items
             WHERE order_id=$1`,
            [orderId]
          );

          for (const item of items.rows) {
            await database.query(
              `UPDATE products
               SET stock = stock - $1
               WHERE id = $2`,
              [item.quantity, item.product_id]
            );
          }
        }
      } catch (err) {
        console.log(err);

        return res
          .status(500)
          .send("Webhook processing failed");
      }
    }

    res.status(200).json({
      received: true,
    });
  }
);

// ============================
// Middlewares
// ============================

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "./uploads/",
  })
);

// ============================
// API Routes
// ============================

app.use("/api/v1/auth", authRouter);

app.use("/api/v1/product", productRouter);

app.use("/api/v1/order", orderRouter);

app.use("/api/v1/admin", adminRouter);

app.use("/api/v1/address", addressRouter);

// ============================
// Create Tables
// ============================

createTables();

// ============================
// Error Middleware
// ============================

app.use(errorMiddleware);

export default app;