import { getPool } from "../loaders/postgresLoader.js";
import type { GetHospitalsPathParam, HospitalCreationBody, HospitalUpdaionBody } from "../contracts/hospital/schema.js";

export async function findHospitalByEmail(email: string) {
    const pool = getPool();

    const result = await pool.query(
        `SELECT id FROM hospitals
         WHERE LOWER(email) = LOWER($1)
         LIMIT 1`,
        [email]
    );

    return result.rows[0] ?? null;
}

export async function findHospitalById(id: string) {
    const pool = getPool();

    const result = await pool.query(
        `SELECT id, image_public_id
         FROM hospitals
         WHERE id = $1
         LIMIT 1`,
        [id]
    );

    return result.rows[0] ?? null;
}

function generateKeyValue<T extends object>(hospitalData: T) {
    const columnMap: Record<string, string> = {
        name: "name",
        email: "email",
        phone: "phone",
        website: "website",
        description: "description",
        streetAddress: "street_address",
        city: "city",
        state: "state",
        country: "country",
        postalCode: "postal_code",
        latitude: "latitude",
        longitude: "longitude",
        image_url: "image_url",
        image_public_id: "image_public_id",
    };

    const entries = Object.entries(hospitalData).filter(
        ([, value]) => value !== undefined && value !== ""
    );

    const hospitalKeys = entries.map(([key]) => {
        const column = columnMap[key];

        if (!column) {
            throw new Error(`Invalid hospital field: ${key}`);
        }

        return column;
    });

    const hospitalValues = entries.map(([, value]) => value);

    return { hospitalKeys, hospitalValues }
}

interface HospitalCreationData extends HospitalCreationBody {
    image_url?: string;
    image_public_id?: string;
}
export async function createHospital(hospitalData: HospitalCreationData) {
    const pool = getPool();

    const { hospitalKeys, hospitalValues } = generateKeyValue(hospitalData);

    const placeholders = hospitalValues
        .map((_, index) => `$${index + 1}`)
        .join(', ');

    const query = `
        INSERT INTO hospitals (${hospitalKeys.join(', ')})
        VALUES (${placeholders})
        RETURNING id, name, email
    `;

    const result = await pool.query(query, hospitalValues);

    return result.rows[0];
}

interface HospitalUpdationData extends HospitalUpdaionBody {
    image_url?: string;
    image_public_id?: string;
}
export async function updateHospital(
    hospitalId: string,
    hospitalData: HospitalUpdationData
) {
    const pool = getPool();

    const { hospitalKeys, hospitalValues } = generateKeyValue(hospitalData);

    const setClause = hospitalKeys
        .map((column, index) => `${column} = $${index + 1}`)
        .join(", ");

    const query = `
        UPDATE hospitals
        SET ${setClause}, updated_at = NOW()
        WHERE id = $${hospitalValues.length + 1}
        RETURNING *
    `;

    const result = await pool.query(query, [...hospitalValues, hospitalId]);

    return result.rows[0] ?? null;
}

export async function getHospitalDetailsById(id: string, status: string | null) {
    const pool = getPool();
    const query = `
        SELECT
            name,
            email,
            phone,
            website,
            description,
            image_url AS "hospitalImage",
            status,
            street_address AS "streetAddress",
            city,
            state,
            country,
            postal_code AS "postalCode",
            latitude,
            longitude
        FROM hospitals
        WHERE id = $1  AND ($2::VARCHAR IS NULL OR status = $2)
        LIMIT 1
    `;

    const result = await pool.query(
        query,
        [id, status]
    );
    return result.rows[0] ?? null;
}

export async function getHospitalCount(): Promise<number> {
    const pool = getPool();

    const query = `
        SELECT COUNT(*) AS total_records
        FROM hospitals;
    `;

    const result = await pool.query(query);

    return Number(result.rows[0]?.total_records ?? 0);
}

export async function getHospitalsByQuery(query: GetHospitalsPathParam) {
    const {
        search,
        sortBy,
        sortOrder,
        limit,
        page,
        status
    } = query;

    const pool = getPool();
    const offset = (page - 1) * limit;

    const sqlQuery = `
        SELECT 
            name,
            email,
            phone,
            website,
            status,
            street_address AS "streetAddress",
            city,
            state,
            country,
            postal_code AS "postalCode",
            latitude,
            longitude
        FROM hospitals
        WHERE name ILIKE $1
        AND ($2 = 'ALL' OR status = $2)
        ORDER BY ${sortBy} ${sortOrder}
        LIMIT $3
        OFFSET $4;
    `;

    const result = await pool.query(sqlQuery, [
        search,
        status,
        limit,
        offset
    ]);

    return result.rows;
}