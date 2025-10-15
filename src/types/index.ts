export interface User {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  role: UserRole;
  parish_id?: string;
  created_at: string;
  updated_at: string;
}

export type UserRole = 'priest' | 'secretary' | 'catechist' | 'volunteer' | 'parish_admin' | 'parishioner';

export interface Parish {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  created_at: string;
}

export interface Staff {
  id: string;
  user_id: string;
  parish_id: string;
  roles: string[];
  availability: string;
  notes?: string;
  active: boolean;
  user?: User;
}

export interface Mass {
  id: string;
  parish_id: string;
  date_time: string;
  type: 'daily' | 'sunday' | 'holiday' | 'special';
  celebrant_id?: string;
  location: string;
  capacity: number;
  registered_count: number;
  status: 'scheduled' | 'confirmed' | 'cancelled';
  celebrant?: User;
}

export interface MassIntention {
  id: string;
  mass_id: string;
  requestor_id: string;
  intention_for: string;
  intention_type: 'living' | 'deceased';
  description?: string;
  amount: number;
  payment_status: 'pending' | 'paid' | 'cancelled';
  payment_method?: 'cash' | 'card' | 'transfer';
  status: 'pending' | 'confirmed' | 'rejected';
  created_at: string;
  mass?: Mass;
  requestor?: User;
}

export interface Sacrament {
  id: string;
  parish_id: string;
  applicant_id: string;
  type: 'baptism' | 'confirmation' | 'marriage' | 'first_communion';
  status: 'pending' | 'in_review' | 'approved' | 'completed' | 'rejected';
  scheduled_date?: string;
  celebrant_id?: string;
  documents: SacramentDocument[];
  requirements_checklist: Record<string, boolean>;
  notes?: string;
  created_at: string;
}

export interface SacramentDocument {
  id: string;
  sacrament_id: string;
  document_type: string;
  file_url: string;
  uploaded_by: string;
  uploaded_at: string;
}

export interface CatechesisGroup {
  id: string;
  parish_id: string;
  name: string;
  age_range: string;
  catechist_id: string;
  schedule: string;
  academic_year: string;
  max_students: number;
  current_students: number;
  active: boolean;
  catechist?: User;
}

export interface Student {
  id: string;
  group_id: string;
  full_name: string;
  date_of_birth: string;
  parent_name: string;
  parent_phone: string;
  parent_email: string;
  medical_notes?: string;
  enrollment_date: string;
  active: boolean;
}

export interface Attendance {
  id: string;
  student_id: string;
  group_id: string;
  date: string;
  present: boolean;
  notes?: string;
  recorded_by: string;
}

export interface Volunteer {
  id: string;
  user_id: string;
  parish_id: string;
  volunteer_roles: string[];
  availability: Record<string, string[]>;
  skills: string[];
  emergency_contact: string;
  emergency_phone: string;
  active: boolean;
  user?: User;
}

export interface VolunteerAssignment {
  id: string;
  volunteer_id: string;
  mass_id?: string;
  event_name?: string;
  date_time: string;
  role: string;
  status: 'assigned' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  volunteer?: Volunteer;
}