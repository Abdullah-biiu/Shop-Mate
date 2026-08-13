import database from "../db.js";

export async function createAddressesTable() {
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS addresses (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

        user_id UUID NOT NULL,

        full_name VARCHAR(150) NOT NULL,
        phone VARCHAR(20) NOT NULL,

        address_line1 TEXT NOT NULL,
        address_line2 TEXT,

        city VARCHAR(100) NOT NULL,
        state VARCHAR(100) NOT NULL,
        country VARCHAR(100) NOT NULL,
        pincode VARCHAR(20) NOT NULL,

        is_default BOOLEAN DEFAULT FALSE,
        is_temporary BOOLEAN DEFAULT FALSE,

        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
      );
    `;

    await database.query(query);

    console.log("✅ Addresses table created.");
  } catch (error) {
    console.error("❌ Failed to create addresses table:", error);
    process.exit(1);
  }
}