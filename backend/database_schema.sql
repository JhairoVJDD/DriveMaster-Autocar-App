-- =========================================================================
-- ESQUEMA DE BASE DE DATOS PARA ESCUELA DE CONDUCTORES (PostgreSQL / Supabase)
-- Ejecutar esto en el SQL Editor de Supabase
-- =========================================================================

-- Habilitar extensión btree_gist para permitir rangos de tiempo y validación estricta de solapamiento
CREATE EXTENSION IF NOT EXISTS btree_gist;

-- 1. Tabla de Instructores
CREATE TABLE instructors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    license_number VARCHAR(50) UNIQUE NOT NULL,
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tabla de Estudiantes
CREATE TABLE students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    document_id VARCHAR(50) UNIQUE NOT NULL, -- DNI o Pasaporte
    email VARCHAR(150) UNIQUE NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Tabla de Vehículos
CREATE TABLE vehicles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    brand VARCHAR(50) NOT NULL,
    model VARCHAR(50) NOT NULL,
    plate_number VARCHAR(15) UNIQUE NOT NULL,
    transmission_type VARCHAR(20) DEFAULT 'MANUAL',
    status VARCHAR(20) DEFAULT 'AVAILABLE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Tabla de Reservas
CREATE TABLE reservations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES students(id),
    instructor_id UUID NOT NULL REFERENCES instructors(id),
    vehicle_id UUID NOT NULL REFERENCES vehicles(id),
    
    reservation_time tsrange NOT NULL,
    shift VARCHAR(20) NOT NULL CHECK (shift IN ('MORNING', 'AFTERNOON', 'NIGHT')), -- Turno: Mañana, Tarde o Noche
    status VARCHAR(20) DEFAULT 'CONFIRMED',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- EXCLUSION CONSTRAINT: Evita cruce de vehículos (mismo vehículo a la misma hora)
    EXCLUDE USING GIST (
        vehicle_id WITH =,
        reservation_time WITH &&
    ),
    
    -- EXCLUSION CONSTRAINT: Evita cruce de instructores (mismo instructor a la misma hora)
    EXCLUDE USING GIST (
        instructor_id WITH =,
        reservation_time WITH &&
    )
);

-- 5. Índices adicionales para rendimiento
CREATE INDEX idx_reservations_time ON reservations USING GIST (reservation_time);
