import dotenv from "dotenv";
import pkg from "pg";

const { Pool } = pkg;

// Load env HERE (critical fix)
dotenv.config({ path: "./config/config.env" });



const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

pool.connect()
  .then(() => console.log("Database connected successfully"))
  .catch(err => console.error("Database connection failed:", err));

export default pool;