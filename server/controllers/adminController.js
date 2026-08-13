import ErrorHandler from "../middlewares/errorMiddleware.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import database from "../database/db.js";
import { v2 as cloudinary } from "cloudinary";
import bcrypt from "bcryptjs";

export const getAllUsers = catchAsyncErrors(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;

  const totalUsersResult = await database.query(
    "SELECT COUNT(*) FROM users WHERE role = $1",
    ["User"]
  );

  const totalUsers = parseInt(totalUsersResult.rows[0].count);

  const offset = (page - 1) * 10;

  const users = await database.query(
    "SELECT * FROM users WHERE role = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3",
    ["User", 10, offset]
  );

  res.status(200).json({
    success: true,
    totalUsers,
    currentPage: page,
    users: users.rows,
  });
});

export const deleteUser = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const deletedUser = await database.query(
    "DELETE FROM users WHERE id = $1 RETURNING *",
    [id]
  );

  if (deletedUser.rows.length === 0) {
    return next(new ErrorHandler("User not found", 404));
  }

  const avatar = deletedUser.rows[0].avatar;

  if (avatar?.public_id) {
    await cloudinary.uploader.destroy(avatar.public_id);
  }

  res.status(200).json({
    success: true,
    message: "User deleted successfully",
  });
});
export const updateAdminProfile = catchAsyncErrors(
  async (req, res, next) => {
    const { name, phone } = req.body;

    const admin = await database.query(
      `UPDATE users
       SET name=$1,
           phone=$2
       WHERE id=$3
       RETURNING *`,
      [name, phone, req.user.id]
    );

    res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      user: admin.rows[0],
    });
  }
);
export const updateAdminPassword = catchAsyncErrors(
  async (req, res, next) => {
    const {
      currentPassword,
      newPassword,
    } = req.body;

    const user = await database.query(
      "SELECT * FROM users WHERE id=$1",
      [req.user.id]
    );

    const admin = user.rows[0];

    const isMatched = await bcrypt.compare(
      currentPassword,
      admin.password
    );

    if (!isMatched) {
      return next(
        new ErrorHandler(
          "Current password is incorrect.",
          400
        )
      );
    }

    const hashedPassword =
      await bcrypt.hash(newPassword, 10);

    await database.query(
      `UPDATE users
       SET password=$1
       WHERE id=$2`,
      [hashedPassword, req.user.id]
    );

    res.status(200).json({
      success: true,
      message: "Password updated successfully.",
    });
  }
);
export const getAdminProfile = catchAsyncErrors(async (req, res, next) => {
  const admin = await database.query(
    `
    SELECT
      id,
      name,
      email,
      phone,
      role,
      avatar,
      created_at
    FROM users
    WHERE id = $1
    `,
    [req.user.id]
  );

  if (admin.rows.length === 0) {
    return next(new ErrorHandler("Admin not found.", 404));
  }

  res.status(200).json({
    success: true,
    user: admin.rows[0],
  });
});

export const dashboardStats = catchAsyncErrors(async (req, res, next) => {
  const today = new Date();

  const todayDate = today.toISOString().split("T")[0];

  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const yesterdayDate = yesterday.toISOString().split("T")[0];

  const currentMonthStart = new Date(
    today.getFullYear(),
    today.getMonth(),
    1
  );

  const currentMonthEnd = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    0
  );

  const previousMonthStart = new Date(
    today.getFullYear(),
    today.getMonth() - 1,
    1
  );

  const previousMonthEnd = new Date(
    today.getFullYear(),
    today.getMonth(),
    0
  );

  // Total Revenue
  const totalRevenueAllTimeQuery = await database.query(`
    SELECT SUM(total_price)
    FROM orders
    WHERE paid_at IS NOT NULL
  `);

  const totalRevenueAllTime =
    parseFloat(totalRevenueAllTimeQuery.rows[0].sum) || 0;

  // Users
  const totalUsersCountQuery = await database.query(`
    SELECT COUNT(*)
    FROM users
    WHERE role='User'
  `);

  const totalUsersCount =
    parseInt(totalUsersCountQuery.rows[0].count) || 0;

  // Order Status
  const orderStatusCountsQuery = await database.query(`
    SELECT order_status,COUNT(*)
    FROM orders
    WHERE paid_at IS NOT NULL
    GROUP BY order_status
  `);

  const orderStatusCounts = {
    Processing: 0,
    Shipped: 0,
    Delivered: 0,
    Cancelled: 0,
  };

  orderStatusCountsQuery.rows.forEach((row) => {
    orderStatusCounts[row.order_status] = Number(row.count);
  });

  // Today's Revenue

  const todayRevenueQuery = await database.query(
    `
    SELECT SUM(total_price)
    FROM orders
    WHERE created_at::date=$1
    AND paid_at IS NOT NULL
`,
    [todayDate]
  );

  const todayRevenue =
    parseFloat(todayRevenueQuery.rows[0].sum) || 0;

  // Yesterday Revenue

  const yesterdayRevenueQuery = await database.query(
    `
    SELECT SUM(total_price)
    FROM orders
    WHERE created_at::date=$1
    AND paid_at IS NOT NULL
`,
    [yesterdayDate]
  );

  const yesterdayRevenue =
    parseFloat(yesterdayRevenueQuery.rows[0].sum) || 0;

  // Monthly Sales

  const monthlySalesQuery = await database.query(`
      SELECT
      TO_CHAR(created_at,'Mon YYYY') AS month,
      DATE_TRUNC('month',created_at) AS date,
      SUM(total_price) AS totalsales
      FROM orders
      WHERE paid_at IS NOT NULL
      GROUP BY month,date
      ORDER BY date ASC
`);

  const monthlySales = monthlySalesQuery.rows.map((row) => ({
    month: row.month,
    totalsales: Number(row.totalsales),
  }));

  // Top Selling Products

  const topSellingProductsQuery = await database.query(`
      SELECT
      p.name,
      p.images->0->>'url' AS image,
      p.category,
      p.ratings,
      SUM(oi.quantity) AS total_sold

      FROM order_items oi

      JOIN products p
      ON oi.product_id=p.id

      JOIN orders o
      ON oi.order_id=o.id

      WHERE o.paid_at IS NOT NULL

      GROUP BY
      p.name,
      p.images,
      p.category,
      p.ratings

      ORDER BY total_sold DESC

      LIMIT 5
`);

  const topSellingProducts = topSellingProductsQuery.rows;

  // Current Month Sales

  const currentMonthSalesQuery = await database.query(
    `
      SELECT SUM(total_price) AS total
      FROM orders
      WHERE paid_at IS NOT NULL
      AND created_at BETWEEN $1 AND $2
`,
    [currentMonthStart, currentMonthEnd]
  );

  const currentMonthSales =
    parseFloat(currentMonthSalesQuery.rows[0].total) || 0;

  // Low Stock Products

  const lowStockProductsQuery = await database.query(`
      SELECT
      name,
      stock
      FROM products
      WHERE stock<=5
`);

  const lowStockProducts = lowStockProductsQuery.rows;

  // Last Month Revenue

  const lastMonthRevenueQuery = await database.query(
    `
      SELECT SUM(total_price) AS total
      FROM orders
      WHERE paid_at IS NOT NULL
      AND created_at BETWEEN $1 AND $2
`,
    [previousMonthStart, previousMonthEnd]
  );

  const lastMonthRevenue =
    parseFloat(lastMonthRevenueQuery.rows[0].total) || 0;

  let revenueGrowth = "0%";

  if (lastMonthRevenue > 0) {
    const growth =
      ((currentMonthSales - lastMonthRevenue) /
        lastMonthRevenue) *
      100;

    revenueGrowth = `${growth >= 0 ? "+" : ""}${growth.toFixed(
      2
    )}%`;
  }

  // New Users

  const newUsersThisMonthQuery = await database.query(
    `
      SELECT COUNT(*)
      FROM users
      WHERE created_at >= $1
      AND role='User'
`,
    [currentMonthStart]
  );

  const newUsersThisMonth =
    parseInt(newUsersThisMonthQuery.rows[0].count) || 0;

  res.status(200).json({
    success: true,
    message: "Dashboard Stats Fetched Successfully",
    totalRevenueAllTime,
    todayRevenue,
    yesterdayRevenue,
    totalUsersCount,
    orderStatusCounts,
    monthlySales,
    currentMonthSales,
    topSellingProducts,
    lowStockProducts,
    revenueGrowth,
    newUsersThisMonth,
  });
});
// ==============================
// GET ALL ORDERS
// ==============================

export const getAllOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await database.query(`
    SELECT
      o.id,
      o.total_price,
      o.tax_price,
      o.shipping_price,
      o.order_status,
      o.paid_at,
      o.created_at,
      u.id AS user_id,
      u.name,
      u.email
    FROM orders o
    JOIN users u
      ON o.buyer_id = u.id
    ORDER BY o.created_at DESC
  `);

  res.status(200).json({
    success: true,
    orders: orders.rows,
  });
});


// ==============================
// GET SINGLE ORDER
// ==============================

export const getSingleOrder = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const order = await database.query(
    `
    SELECT
      o.*,
      u.name,
      u.email,
      u.phone
    FROM orders o
    JOIN users u
      ON o.buyer_id = u.id
    WHERE o.id = $1
    `,
    [id]
  );

  if (order.rows.length === 0) {
    return next(new ErrorHandler("Order not found", 404));
  }

  const items = await database.query(
    `
    SELECT
      oi.*,
      p.name,
      p.images
    FROM order_items oi
    JOIN products p
      ON oi.product_id = p.id
    WHERE oi.order_id = $1
    `,
    [id]
  );

  res.status(200).json({
    success: true,
    order: order.rows[0],
    items: items.rows,
  });
});


// ==============================
// UPDATE ORDER STATUS
// ==============================

export const updateOrderStatus = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;

  const order = await database.query(
    "SELECT * FROM orders WHERE id = $1",
    [id]
  );

  if (order.rows.length === 0) {
    return next(new ErrorHandler("Order not found.", 404));
  }

  const updatedOrder = await database.query(
    `
    UPDATE orders
    SET order_status = $1
    WHERE id = $2
    RETURNING *
    `,
    [status, id]
  );

  res.status(200).json({
    success: true,
    message: "Order status updated successfully.",
    order: updatedOrder.rows[0],
  });
});