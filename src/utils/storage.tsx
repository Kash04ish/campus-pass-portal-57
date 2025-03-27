
// Type definitions
export interface PassRequest {
  id: string;
  studentId: string;
  rollNumber: string;
  leavingTime: string;
  returningTime: string;
  purpose: string;
  status: 'pending' | 'approved' | 'rejected';
  qrCode?: string;
  createdAt: string;
}

export interface Student {
  id: string;
  name: string;
  rollNumber: string;
  roomNumber: string;
  hostelName: string;
  contactNumber: string;
  photoUrl: string;
}

// Mock storage functions
const STUDENTS_KEY = 'campus_pass_students';
const PASS_REQUESTS_KEY = 'campus_pass_requests';

// Student functions
export const getStudents = (): Student[] => {
  const stored = localStorage.getItem(STUDENTS_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const saveStudent = (student: Student): Student => {
  const students = getStudents();
  
  // Check if student already exists
  const existingIndex = students.findIndex(s => s.rollNumber === student.rollNumber);
  
  if (existingIndex >= 0) {
    // Update existing student
    students[existingIndex] = { ...students[existingIndex], ...student };
  } else {
    // Add new student
    students.push(student);
  }
  
  localStorage.setItem(STUDENTS_KEY, JSON.stringify(students));
  return student;
};

export const getStudentByRollNumber = (rollNumber: string): Student | null => {
  const students = getStudents();
  return students.find(student => student.rollNumber === rollNumber) || null;
};

// Pass request functions
export const getPassRequests = (): PassRequest[] => {
  const stored = localStorage.getItem(PASS_REQUESTS_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const savePassRequest = (request: Omit<PassRequest, 'id' | 'createdAt'>): PassRequest => {
  const requests = getPassRequests();
  
  const newRequest: PassRequest = {
    ...request,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  
  requests.push(newRequest);
  localStorage.setItem(PASS_REQUESTS_KEY, JSON.stringify(requests));
  return newRequest;
};

export const updatePassRequest = (id: string, updates: Partial<PassRequest>): PassRequest | null => {
  const requests = getPassRequests();
  const index = requests.findIndex(r => r.id === id);
  
  if (index === -1) return null;
  
  requests[index] = { ...requests[index], ...updates };
  localStorage.setItem(PASS_REQUESTS_KEY, JSON.stringify(requests));
  return requests[index];
};

export const getPassRequestsByStudent = (studentId: string): PassRequest[] => {
  const requests = getPassRequests();
  return requests.filter(request => request.studentId === studentId);
};

export const getPassRequestById = (id: string): PassRequest | null => {
  const requests = getPassRequests();
  return requests.find(request => request.id === id) || null;
};

// QR Code generation (mock)
export const generateQRCode = (passRequest: PassRequest): string => {
  // In a real application, you would use a QR code generation library
  // For now, we'll just return a base64 encoded string representing the pass details
  const passData = {
    id: passRequest.id,
    rollNumber: passRequest.rollNumber,
    leavingTime: passRequest.leavingTime,
    returningTime: passRequest.returningTime,
    purpose: passRequest.purpose
  };
  
  // This would normally be a QR code image
  return `data:image/png;base64,${btoa(JSON.stringify(passData))}`;
};
