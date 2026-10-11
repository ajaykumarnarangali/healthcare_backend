CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE doctor_licenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    license_number VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    issuing_authority VARCHAR(255) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    verified_at TIMESTAMPTZ,

    UNIQUE (issuing_authority, license_number)
);