import { getPool } from "../loaders/postgresLoader.js";
import { USER_STATUS } from "../constants/user.constants.js";

export async function getUser(email: string) {
    const pool = getPool();

    const result = await pool.query(
        `SELECT * FROM users
        WHERE email = $1`,
        [email]
    );

    return result.rows[0];
}

export async function doctorLicenseExists(
    email: string,
    licenseNumber: string
): Promise<boolean> {
    const pool = getPool();

    const result = await pool.query(
        `SELECT EXISTS (
            SELECT 1
            FROM doctor_licenses
            WHERE email = $1
              AND license_number = $2
              AND status = 'ACTIVE'
        ) AS exists`,
        [email, licenseNumber]
    );

    return result.rows[0].exists;
}

export async function createUser(
    email: string,
    passwordHash: string,
    role: string
) {
    const pool = getPool();

    const result = await pool.query(
        `INSERT INTO users (email, password_hash,role)
        VALUES ($1, $2, $3)
        RETURNING id, email`,
        [email, passwordHash, role]
    );

    return result.rows[0];
}

export async function getUserById(userId: string) {
    const pool = getPool();

    const result = await pool.query(
        `
        SELECT id,status,email,role,email_verified,password_hash
        FROM users
        WHERE id = $1
        `,
        [userId]
    );

    return result.rows[0];
}

export async function getUserSummary(userId: string) {
    const pool = getPool();

    const result = await pool.query(
        `
        SELECT
            up.first_name,
            up.profile_photo
        FROM users u
        LEFT JOIN user_profiles up
            ON u.id = up.user_id
        WHERE u.id = $1
        `,
        [userId]
    );

    return result.rows[0];
}

export async function getUserPermissions(role: string) {
    const pool = getPool();

    const result = await pool.query(
        `
        SELECT p.name
        FROM role_permissions AS rp
        JOIN permissions AS p
            ON rp.permission_id = p.permission_id
        WHERE rp.role = $1;
        `,
        [role]
    );

    return result.rows.map((row) => row.name);
}

export async function verifyUser(userId: string) {
    const pool = getPool();

    await pool.query(
        `
        UPDATE users
        SET
            email_verified = TRUE,
            status = $2,
            updated_at = NOW()
        WHERE id = $1
        `,
        [userId, USER_STATUS.ACTIVE]
    );
}