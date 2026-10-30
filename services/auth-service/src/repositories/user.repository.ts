import { getPool } from "../loaders/postgresLoader.js";
import { USER_STATUS } from "../constants/user.constants.js";
import type { createPatientProfileBody } from "../contracts/user/schema.js";

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

export async function getProfileByUserId(userId: string) {
    const pool = getPool();

    const result = await pool.query(
        `
        SELECT
            u.id AS user_id,
            u.email,
            up.first_name,
            up.last_name,
            up.phone,
            up.date_of_birth,
            up.gender,
            up.profile_photo,
            up.street_address,
            up.city,
            up.state,
            up.country,
            up.postal_code,
        FROM users u
        LEFT JOIN user_profiles up
            ON u.id = up.user_id
        WHERE u.id = $1
        `,
        [userId]
    );

    return result.rows[0];
}

export async function isProfileExists(userId: string): Promise<boolean> {
    const pool = getPool();

    const result = await pool.query(
        `
        SELECT EXISTS (
            SELECT 1
            FROM user_profiles
            WHERE user_id = $1
        ) AS exists
        `,
        [userId]
    );

    return result.rows[0].exists;
}

export type profileData = createPatientProfileBody & {
    profile_photo: string | null;
    profile_photo_public_id: string | null;
};
export async function createUserProfile(
    userId: string,
    data: profileData
) {
    const pool = getPool();

    const query = `
        INSERT INTO user_profiles (
            user_id,
            first_name,
            last_name,
            phone,
            date_of_birth,
            gender,
            profile_photo,
            profile_photo_public_id,
            street_address,
            city,
            state,
            country,
            postal_code
        )
        VALUES (
            $1, $2, $3, $4, $5, $6, $7,
            $8, $9, $10, $11, $12, $13
        )
        RETURNING
            user_id AS "userId",
            first_name AS "firstName",
            last_name AS "lastName",
            phone,
            date_of_birth AS "dateOfBirth",
            gender,
            profile_photo AS "profilePhoto",
            street_address AS "streetAddress",
            city,
            state,
            country,
            postal_code AS "postalCode",
            profile_completed AS "profileCompleted";
    `;

    const values = [
        userId,
        data.firstName,
        data.lastName ?? null,
        data.phone,
        data.dateOfBirth,
        data.gender,
        data.profile_photo,
        data.profile_photo_public_id,
        data.streetAddress ?? null,
        data.city ?? null,
        data.state ?? null,
        data.country ?? null,
        data.postalCode ?? null,
    ];

    const result = await pool.query(query, values);

    return result.rows[0];
}