import { pool } from "../../config/db";
import { hashPassword } from "../../utils/bycript";
import { CreateUserPayload } from "../authentication/auth.service";

const getUser = async () => {
  const result = await pool.query(`SELECT * FROM users`);
  return result;
};

const AdminUpdateUser = async (
  id: number,
  payload: Partial<CreateUserPayload>
) => {
  const fields = [];
  const values = [];
  let idx = 1;

  if (payload.name) {
    fields.push(`name=$${idx++}`);
    values.push(payload.name);
  }
  if (payload.password) {
    const hashed = await hashPassword(payload.password);

    fields.push(`password=$${idx++}`);
    values.push(hashed);
  }
  if (payload.phone) {
    fields.push(`phone=$${idx++}`);
    values.push(payload.phone);
  }
  if (payload.role) {
    fields.push(`role=$${idx++}`);
    values.push(payload.role);
  }

  if (fields.length === 0) {
    throw new Error("No fields to update");
  }

  values.push(id);

  const query = `UPDATE users SET ${fields.join(
    ", "
  )} WHERE id=$${idx} RETURNING *`;
  const result = await pool.query(query, values);

  return result;
};
const CustomerUpdateUser = async (
  id: number,
  payload: Partial<CreateUserPayload>
) => {
  const fields = [];
  const values = [];
  let idx = 1;

  if (payload.name) {
    fields.push(`name=$${idx++}`);
    values.push(payload.name);
  }
  if (payload.password) {
    const hashed = await hashPassword(payload.password);

    fields.push(`password=$${idx++}`);
    values.push(hashed);
  }
  if (payload.phone) {
    fields.push(`phone=$${idx++}`);
    values.push(payload.phone);
  }

  if (fields.length === 0) {
    throw new Error("No fields to update");
  }

  values.push(id);

  const query = `UPDATE users SET ${fields.join(
    ", "
  )} WHERE id=$${idx} RETURNING *`;
  const result = await pool.query(query, values);

  return result;
};

const DeleteUser = async (id: number) => {
  try {
    const result = await pool.query("DELETE FROM users WHERE id = $1", [id]);
    return result;
  } catch (Err) {
    throw Err;
  }
};

export const userServices = {
  getUser,
  AdminUpdateUser,
  CustomerUpdateUser,
  DeleteUser,
};
