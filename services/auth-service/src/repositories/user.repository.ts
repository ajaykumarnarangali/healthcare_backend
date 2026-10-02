import { getPool } from "../loaders/postgresLoader.js";
import { USER_ROLES } from "../constants/user.constants.js";

export async function getUser(email: string) {
    const pool = getPool();

    const result = await pool.query(
        `SELECT * FROM users
        WHERE email = $1`,
        [email]
    );

    return result.rows[0];
}

export async function createUser(
    email: string,
    passwordHash: string
) {
    const pool = getPool();

    const result = await pool.query(
        `INSERT INTO users (email, password_hash,role)
        VALUES ($1, $2)
        RETURNING id, email`,
        [email, passwordHash, USER_ROLES.PATIENT]
    );

    return result.rows[0];
}