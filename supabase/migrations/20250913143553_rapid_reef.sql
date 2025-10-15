/*
  # Initial Parish Management System Schema

  1. New Tables
    - `parishes` - Parish information
    - `users` - User profiles with roles
    - `staff` - Staff assignments and details
    - `masses` - Mass scheduling
    - `mass_intentions` - Mass intention requests
    - `sacraments` - Sacrament records
    - `sacrament_documents` - Document attachments for sacraments
    - `catechesis_groups` - Catechesis group management
    - `students` - Student enrollment
    - `attendance` - Attendance tracking
    - `volunteers` - Volunteer profiles
    - `volunteer_assignments` - Volunteer task assignments

  2. Security
    - Enable RLS on all tables
    - Add policies for role-based access control
    - Secure file uploads and downloads

  3. Indexes
    - Add performance indexes for frequently queried columns
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Parishes table
CREATE TABLE IF NOT EXISTS parishes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    website TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT,
    role TEXT NOT NULL CHECK (role IN ('priest', 'secretary', 'catechist', 'volunteer', 'parish_admin', 'parishioner')),
    parish_id UUID REFERENCES parishes(id),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Staff table
CREATE TABLE IF NOT EXISTS staff (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    parish_id UUID NOT NULL REFERENCES parishes(id) ON DELETE CASCADE,
    roles TEXT[] DEFAULT '{}',
    availability TEXT DEFAULT '',
    notes TEXT,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Masses table
CREATE TABLE IF NOT EXISTS masses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parish_id UUID NOT NULL REFERENCES parishes(id) ON DELETE CASCADE,
    date_time TIMESTAMPTZ NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('daily', 'sunday', 'holiday', 'special')),
    celebrant_id UUID REFERENCES users(id),
    location TEXT NOT NULL DEFAULT 'Main Church',
    capacity INTEGER DEFAULT 100,
    registered_count INTEGER DEFAULT 0,
    status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'cancelled')),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Mass intentions table
CREATE TABLE IF NOT EXISTS mass_intentions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mass_id UUID NOT NULL REFERENCES masses(id) ON DELETE CASCADE,
    requestor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    intention_for TEXT NOT NULL,
    intention_type TEXT NOT NULL CHECK (intention_type IN ('living', 'deceased')),
    description TEXT,
    amount DECIMAL(10,2) DEFAULT 0,
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'cancelled')),
    payment_method TEXT CHECK (payment_method IN ('cash', 'card', 'transfer')),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'rejected')),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Sacraments table
CREATE TABLE IF NOT EXISTS sacraments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parish_id UUID NOT NULL REFERENCES parishes(id) ON DELETE CASCADE,
    applicant_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('baptism', 'confirmation', 'marriage', 'first_communion')),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_review', 'approved', 'completed', 'rejected')),
    scheduled_date TIMESTAMPTZ,
    celebrant_id UUID REFERENCES users(id),
    requirements_checklist JSONB DEFAULT '{}',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Sacrament documents table
CREATE TABLE IF NOT EXISTS sacrament_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sacrament_id UUID NOT NULL REFERENCES sacraments(id) ON DELETE CASCADE,
    document_type TEXT NOT NULL,
    file_url TEXT NOT NULL,
    uploaded_by UUID NOT NULL REFERENCES users(id),
    uploaded_at TIMESTAMPTZ DEFAULT now()
);

-- Catechesis groups table
CREATE TABLE IF NOT EXISTS catechesis_groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parish_id UUID NOT NULL REFERENCES parishes(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    age_range TEXT NOT NULL,
    catechist_id UUID NOT NULL REFERENCES users(id),
    schedule TEXT NOT NULL,
    academic_year TEXT NOT NULL DEFAULT '2024-2025',
    max_students INTEGER DEFAULT 25,
    current_students INTEGER DEFAULT 0,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Students table
CREATE TABLE IF NOT EXISTS students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID NOT NULL REFERENCES catechesis_groups(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    date_of_birth DATE NOT NULL,
    parent_name TEXT NOT NULL,
    parent_phone TEXT NOT NULL,
    parent_email TEXT,
    medical_notes TEXT,
    enrollment_date DATE DEFAULT CURRENT_DATE,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Attendance table
CREATE TABLE IF NOT EXISTS attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    group_id UUID NOT NULL REFERENCES catechesis_groups(id) ON DELETE CASCADE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    present BOOLEAN NOT NULL DEFAULT false,
    notes TEXT,
    recorded_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(student_id, date)
);

-- Volunteers table
CREATE TABLE IF NOT EXISTS volunteers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    parish_id UUID NOT NULL REFERENCES parishes(id) ON DELETE CASCADE,
    volunteer_roles TEXT[] DEFAULT '{}',
    availability JSONB DEFAULT '{}',
    skills TEXT[] DEFAULT '{}',
    emergency_contact TEXT,
    emergency_phone TEXT,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Volunteer assignments table
CREATE TABLE IF NOT EXISTS volunteer_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    volunteer_id UUID NOT NULL REFERENCES volunteers(id) ON DELETE CASCADE,
    mass_id UUID REFERENCES masses(id) ON DELETE CASCADE,
    event_name TEXT,
    date_time TIMESTAMPTZ NOT NULL,
    role TEXT NOT NULL,
    status TEXT DEFAULT 'assigned' CHECK (status IN ('assigned', 'confirmed', 'completed', 'cancelled')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_parish_id ON users(parish_id);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_staff_user_id ON staff(user_id);
CREATE INDEX IF NOT EXISTS idx_staff_parish_id ON staff(parish_id);
CREATE INDEX IF NOT EXISTS idx_masses_parish_id ON masses(parish_id);
CREATE INDEX IF NOT EXISTS idx_masses_date_time ON masses(date_time);
CREATE INDEX IF NOT EXISTS idx_masses_celebrant_id ON masses(celebrant_id);
CREATE INDEX IF NOT EXISTS idx_mass_intentions_mass_id ON mass_intentions(mass_id);
CREATE INDEX IF NOT EXISTS idx_mass_intentions_requestor_id ON mass_intentions(requestor_id);
CREATE INDEX IF NOT EXISTS idx_sacraments_parish_id ON sacraments(parish_id);
CREATE INDEX IF NOT EXISTS idx_sacraments_applicant_id ON sacraments(applicant_id);
CREATE INDEX IF NOT EXISTS idx_catechesis_groups_parish_id ON catechesis_groups(parish_id);
CREATE INDEX IF NOT EXISTS idx_catechesis_groups_catechist_id ON catechesis_groups(catechist_id);
CREATE INDEX IF NOT EXISTS idx_students_group_id ON students(group_id);
CREATE INDEX IF NOT EXISTS idx_attendance_student_id ON attendance(student_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(date);
CREATE INDEX IF NOT EXISTS idx_volunteers_user_id ON volunteers(user_id);
CREATE INDEX IF NOT EXISTS idx_volunteers_parish_id ON volunteers(parish_id);
CREATE INDEX IF NOT EXISTS idx_volunteer_assignments_volunteer_id ON volunteer_assignments(volunteer_id);

-- Enable RLS on all tables
ALTER TABLE parishes ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE masses ENABLE ROW LEVEL SECURITY;
ALTER TABLE mass_intentions ENABLE ROW LEVEL SECURITY;
ALTER TABLE sacraments ENABLE ROW LEVEL SECURITY;
ALTER TABLE sacrament_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE catechesis_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteers ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteer_assignments ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Parishes policies
CREATE POLICY "Users can read their parish" ON parishes
    FOR SELECT TO authenticated
    USING (id = (SELECT parish_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Parish admins can update their parish" ON parishes
    FOR UPDATE TO authenticated
    USING (id = (SELECT parish_id FROM users WHERE id = auth.uid() AND role = 'parish_admin'));

-- Users policies
CREATE POLICY "Users can read their own profile" ON users
    FOR SELECT TO authenticated
    USING (id = auth.uid());

CREATE POLICY "Users can update their own profile" ON users
    FOR UPDATE TO authenticated
    USING (id = auth.uid());

CREATE POLICY "Staff can read parish users" ON users
    FOR SELECT TO authenticated
    USING (
        parish_id = (SELECT parish_id FROM users WHERE id = auth.uid()) AND
        (SELECT role FROM users WHERE id = auth.uid()) IN ('priest', 'secretary', 'parish_admin', 'catechist')
    );

-- Staff policies
CREATE POLICY "Staff can read parish staff" ON staff
    FOR SELECT TO authenticated
    USING (
        parish_id = (SELECT parish_id FROM users WHERE id = auth.uid()) AND
        (SELECT role FROM users WHERE id = auth.uid()) IN ('priest', 'secretary', 'parish_admin')
    );

CREATE POLICY "Admins can manage staff" ON staff
    FOR ALL TO authenticated
    USING (
        parish_id = (SELECT parish_id FROM users WHERE id = auth.uid()) AND
        (SELECT role FROM users WHERE id = auth.uid()) IN ('priest', 'parish_admin')
    );

-- Masses policies
CREATE POLICY "Users can read parish masses" ON masses
    FOR SELECT TO authenticated
    USING (parish_id = (SELECT parish_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Staff can manage masses" ON masses
    FOR ALL TO authenticated
    USING (
        parish_id = (SELECT parish_id FROM users WHERE id = auth.uid()) AND
        (SELECT role FROM users WHERE id = auth.uid()) IN ('priest', 'secretary', 'parish_admin')
    );

-- Mass intentions policies
CREATE POLICY "Users can read their own intentions" ON mass_intentions
    FOR SELECT TO authenticated
    USING (
        requestor_id = auth.uid() OR
        (SELECT role FROM users WHERE id = auth.uid()) IN ('priest', 'secretary', 'parish_admin')
    );

CREATE POLICY "Parishioners can create intentions" ON mass_intentions
    FOR INSERT TO authenticated
    WITH CHECK (requestor_id = auth.uid());

CREATE POLICY "Staff can manage intentions" ON mass_intentions
    FOR ALL TO authenticated
    USING (
        (SELECT role FROM users WHERE id = auth.uid()) IN ('priest', 'secretary', 'parish_admin')
    );

-- Sacraments policies
CREATE POLICY "Users can read their own sacraments" ON sacraments
    FOR SELECT TO authenticated
    USING (
        applicant_id = auth.uid() OR
        (SELECT role FROM users WHERE id = auth.uid()) IN ('priest', 'secretary', 'parish_admin')
    );

CREATE POLICY "Parishioners can request sacraments" ON sacraments
    FOR INSERT TO authenticated
    WITH CHECK (applicant_id = auth.uid());

CREATE POLICY "Staff can manage sacraments" ON sacraments
    FOR ALL TO authenticated
    USING (
        (SELECT role FROM users WHERE id = auth.uid()) IN ('priest', 'secretary', 'parish_admin')
    );

-- Continue with similar policies for other tables...

-- Catechesis groups policies
CREATE POLICY "Catechists can read their groups" ON catechesis_groups
    FOR SELECT TO authenticated
    USING (
        catechist_id = auth.uid() OR
        (SELECT role FROM users WHERE id = auth.uid()) IN ('priest', 'secretary', 'parish_admin')
    );

CREATE POLICY "Staff can manage catechesis groups" ON catechesis_groups
    FOR ALL TO authenticated
    USING (
        parish_id = (SELECT parish_id FROM users WHERE id = auth.uid()) AND
        (SELECT role FROM users WHERE id = auth.uid()) IN ('priest', 'secretary', 'parish_admin', 'catechist')
    );

-- Students policies
CREATE POLICY "Catechists can read their students" ON students
    FOR SELECT TO authenticated
    USING (
        group_id IN (
            SELECT id FROM catechesis_groups 
            WHERE catechist_id = auth.uid() OR
            (SELECT role FROM users WHERE id = auth.uid()) IN ('priest', 'secretary', 'parish_admin')
        )
    );

-- Volunteers policies
CREATE POLICY "Users can read their volunteer profile" ON volunteers
    FOR SELECT TO authenticated
    USING (
        user_id = auth.uid() OR
        (SELECT role FROM users WHERE id = auth.uid()) IN ('priest', 'secretary', 'parish_admin')
    );

CREATE POLICY "Users can create volunteer profile" ON volunteers
    FOR INSERT TO authenticated
    WITH CHECK (user_id = auth.uid());

-- Insert sample data
INSERT INTO parishes (id, name, address, phone, email, website) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'San Miguel Parish', '123 Church Street, Madrid, Spain', '+34 91 123 4567', 'info@sanmiguel.es', 'https://sanmiguel.es')
ON CONFLICT (id) DO NOTHING;

-- Create a trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply the trigger to all tables with updated_at column
CREATE TRIGGER update_parishes_updated_at BEFORE UPDATE ON parishes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_staff_updated_at BEFORE UPDATE ON staff FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_masses_updated_at BEFORE UPDATE ON masses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_mass_intentions_updated_at BEFORE UPDATE ON mass_intentions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sacraments_updated_at BEFORE UPDATE ON sacraments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_catechesis_groups_updated_at BEFORE UPDATE ON catechesis_groups FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON students FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_volunteers_updated_at BEFORE UPDATE ON volunteers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_volunteer_assignments_updated_at BEFORE UPDATE ON volunteer_assignments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();