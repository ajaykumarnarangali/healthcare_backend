import { getPool } from "../loaders/postgresLoader.js";
import type { HospitalCreationBody } from "../contracts/hospital/schema.js";

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


interface HospitalCreationData extends HospitalCreationBody {
    image_url?: string;
    image_public_id?: string;
}
export async function createHospital(hospitalData: HospitalCreationData) {
    const pool = getPool();

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

    const hospitalValues = Object.values(hospitalData);

    const placeholders = hospitalValues
        .map((_, index) => `$${index + 1}`)
        .join(', ');

    const result = await pool.query(
        `INSERT INTO hospitals (${hospitalKeys.join(', ')})
         VALUES (${placeholders})
         RETURNING id, name, email`,
        hospitalValues
    );

    return result.rows[0];
}