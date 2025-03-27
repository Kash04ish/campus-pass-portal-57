
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
  studentName?: string; // Added to store student name for better display
  contactNumber?: string; // Added to store contact for notifications
  notificationSent?: boolean; // Track if notification was sent
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

export const getStudentById = (id: string): Student | null => {
  const students = getStudents();
  return students.find(student => student.id === id) || null;
};

// Pass request functions
export const getPassRequests = (): PassRequest[] => {
  const stored = localStorage.getItem(PASS_REQUESTS_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const savePassRequest = (request: Omit<PassRequest, 'id' | 'createdAt'>): PassRequest => {
  const requests = getPassRequests();
  
  // Get student info to include in the pass request
  const student = getStudentById(request.studentId);
  
  const newRequest: PassRequest = {
    ...request,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    studentName: student?.name,
    contactNumber: student?.contactNumber,
    notificationSent: false,
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

// QR Code generation (improved)
export const generateQRCode = (passRequest: PassRequest): string => {
  // Get student details to include in QR code
  const student = getStudentByRollNumber(passRequest.rollNumber);
  
  // Create a more comprehensive data object for the QR code
  const passData = {
    id: passRequest.id,
    student: {
      name: student?.name || passRequest.studentName || "Unknown",
      rollNumber: passRequest.rollNumber,
      hostel: student?.hostelName || "Unknown",
      roomNumber: student?.roomNumber || "Unknown",
      contactNumber: student?.contactNumber || passRequest.contactNumber || "Unknown",
    },
    pass: {
      leavingTime: passRequest.leavingTime,
      returningTime: passRequest.returningTime,
      purpose: passRequest.purpose,
      status: passRequest.status,
      issuedAt: new Date().toISOString(),
    }
  };
  
  // In a real application, you would use a proper QR code library
  // For now, we'll return a base64 encoded string with more detailed information
  return `data:image/png;base64,${btoa(JSON.stringify(passData))}`;
};

// New function to simulate sending notification to student
export const notifyStudentAboutPass = (passRequest: PassRequest): boolean => {
  // In a real application, this would send an email, SMS, or push notification
  console.log(`Notification sent to ${passRequest.studentName} about pass ${passRequest.id}`);
  
  // Mark the notification as sent
  updatePassRequest(passRequest.id, { notificationSent: true });
  return true;
};
