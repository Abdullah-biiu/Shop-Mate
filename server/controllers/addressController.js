import database from "../database/db.js";

// ================= GET USER ADDRESSES =================
export const getAddresses = async (req, res, next) => {
  try {
    const { rows } = await database.query(
      `
      SELECT *
      FROM addresses
      WHERE user_id = $1
      ORDER BY is_default DESC, created_at DESC
      `,
      [req.user.id]
    );

    res.status(200).json({
      success: true,
      addresses: rows,
    });
  } catch (error) {
    next(error);
  }
};

// ================= ADD ADDRESS =================
export const addAddress = async (req, res, next) => {
  try {
    const {
      full_name,
      phone,
      address_line1,
      address_line2,
      city,
      state,
      country,
      pincode,
      is_temporary,
    } = req.body;

    // First address becomes default
    const { rows: existing } = await database.query(
      "SELECT id FROM addresses WHERE user_id=$1",
      [req.user.id]
    );

    const isDefault = existing.length === 0;

    const { rows } = await database.query(
      `
      INSERT INTO addresses
      (
        user_id,
        full_name,
        phone,
        address_line1,
        address_line2,
        city,
        state,
        country,
        pincode,
        is_default,
        is_temporary
      )
      VALUES
      (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11
      )
      RETURNING *
      `,
      [
        req.user.id,
        full_name,
        phone,
        address_line1,
        address_line2,
        city,
        state,
        country,
        pincode,
        isDefault,
        is_temporary || false,
      ]
    );

    res.status(201).json({
      success: true,
      message: "Address added successfully",
      address: rows[0],
    });
  } catch (error) {
    next(error);
  }
};

// ================= UPDATE ADDRESS =================
// ================= UPDATE ADDRESS =================
export const updateAddress = async (req, res, next) => {
  try {
    console.log("========== UPDATE ADDRESS ==========");
    console.log("Params:", req.params);
    console.log("User:", req.user);
    console.log("Body:", req.body);

    const {
      full_name,
      phone,
      address_line1,
      address_line2,
      city,
      state,
      country,
      pincode,
      is_temporary,
    } = req.body;

    console.log("Running UPDATE query...");

    const { rows } = await database.query(
      `
      UPDATE addresses
      SET
        full_name = $1,
        phone = $2,
        address_line1 = $3,
        address_line2 = $4,
        city = $5,
        state = $6,
        country = $7,
        pincode = $8,
        is_temporary = $9
      WHERE id = $10
      AND user_id = $11
      RETURNING *
      `,
      [
        full_name,
        phone,
        address_line1,
        address_line2 || null,
        city,
        state,
        country,
        pincode,
        is_temporary || false,
        req.params.id,
        req.user.id,
      ]
    );

    console.log("Rows returned:", rows);

    if (!rows.length) {
      console.log("No address matched.");
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Address updated successfully",
      address: rows[0],
    });
  } catch (error) {
    console.log("ERROR:", error);
    next(error);
  }
};
// ================= DELETE ADDRESS =================
export const deleteAddress = async (req, res, next) => {
  try {
    await database.query(
      `
      DELETE FROM addresses
      WHERE id=$1
      AND user_id=$2
      `,
      [req.params.id, req.user.id]
    );

    res.status(200).json({
      success: true,
      message: "Address deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// ================= SET DEFAULT ADDRESS =================
export const setDefaultAddress = async (req, res, next) => {
  try {
    await database.query(
      `
      UPDATE addresses
      SET is_default=false
      WHERE user_id=$1
      `,
      [req.user.id]
    );

    await database.query(
      `
      UPDATE addresses
      SET is_default=true
      WHERE id=$1
      AND user_id=$2
      `,
      [req.params.id, req.user.id]
    );

    res.status(200).json({
      success: true,
      message: "Default address updated",
    });
  } catch (error) {
    next(error);
  }
};