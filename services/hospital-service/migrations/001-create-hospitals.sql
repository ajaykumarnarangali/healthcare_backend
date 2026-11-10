CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE hospitals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Hospital Information
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL,
    website VARCHAR(255),
    description TEXT,
    image_url TEXT,
    image_public_id VARCHAR(255),

    -- Hospital Status
    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE'
        CHECK (status IN ('ACTIVE', 'INACTIVE')),

    -- Hospital Address
    street_address VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20),

    -- Hospital Location
    latitude DECIMAL(9,6),
    longitude DECIMAL(9,6),

    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Coordinate validation
    CONSTRAINT valid_latitude
        CHECK (latitude IS NULL OR latitude BETWEEN -90 AND 90),

    CONSTRAINT valid_longitude
        CHECK (longitude IS NULL OR longitude BETWEEN -180 AND 180)
);