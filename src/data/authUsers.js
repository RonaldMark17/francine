// Authentic user accounts for buyers (Students, Teachers) and Store Admin
export const INITIAL_USERS = [
  {
    id: 'usr-student-1',
    email: 'student@plaridel.edu.ph',
    password: 'password123',
    name: 'Maria Santos',
    phone: '0917-882-9411',
    role: 'buyer', // buyer role (students and teachers)
    affiliation: 'Plaridel Integrated National High School',
    idNumber: '2026-PINHS-042',
    joinedDate: '2026-01-15',
    savedAddress: 'Purok 3, Barangay Banago, Nagcarlan, Laguna 4002',
    ordersCount: 3
  },
  {
    id: 'usr-teacher-1',
    email: 'teacher.mendoza@deped.gov.ph',
    password: 'password123',
    name: 'Mr. Ronald Mendoza',
    phone: '0928-554-1290',
    role: 'buyer', // buyer role (students and teachers)
    affiliation: 'Plaridel Elementary School Faculty',
    idNumber: 'DEPED-4A-1082',
    joinedDate: '2025-08-20',
    savedAddress: 'Purok 5, Barangay Banago, Nagcarlan, Laguna 4002',
    ordersCount: 5
  },
  {
    id: 'usr-admin-1',
    email: 'admin',
    password: 'admin123',
    name: 'Anne Francine Celerio (Store Manager)',
    phone: '+63 917 882 6262',
    role: 'admin',
    affiliation: 'Mama Mo Strategic Retail Team (4BSBA-MM1)',
    idNumber: 'MGR-001',
    joinedDate: '2026-02-01',
    savedAddress: 'Purok 5, Barangay Banago, Nagcarlan, Laguna 4002',
    ordersCount: 0
  },
  {
    id: 'usr-admin-2',
    email: 'admin@mamamoinkprint.ph',
    password: 'admin123',
    name: 'Anne Francine Celerio (Store Manager)',
    phone: '+63 917 882 6262',
    role: 'admin',
    affiliation: 'Mama Mo Strategic Retail Team (4BSBA-MM1)',
    idNumber: 'MGR-001',
    joinedDate: '2026-02-01',
    savedAddress: 'Purok 5, Barangay Banago, Nagcarlan, Laguna 4002',
    ordersCount: 0
  }
];
