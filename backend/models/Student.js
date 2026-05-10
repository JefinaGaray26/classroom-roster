const db = require('../config/db');

class StudentModel {
  // Get all students (with optional filters)
  static async findAll(filters = {}) {
    if (Object.keys(filters).length > 0) {
      return await db.query('students', filters);
    }
    return await db.get('students');
  }

  // Find student by ID
  static async findById(id) {
    return await db.getById('students', id);
  }

  // Find by studentId (e.g., STU-001)
  static async findByStudentId(studentId) {
    const students = await db.query('students', { studentId });
    return students.length > 0 ? students[0] : null;
  }

  // Find by email
  static async findByEmail(email) {
    const students = await db.query('students', { email });
    return students.length > 0 ? students[0] : null;
  }

  // Create new student
  static async create(studentData) {
    // Auto-generate studentId
    const allStudents = await db.get('students');
    const nextNum = allStudents.length + 1;
    const studentId = `STU-${String(nextNum).padStart(3, '0')}`;

    const newStudent = {
      studentId,
      firstName: studentData.firstName,
      lastName: studentData.lastName,
      email: studentData.email,
      course: studentData.course,
      year: parseInt(studentData.year),
      section: studentData.section,
      gender: studentData.gender,
      contactNumber: studentData.contactNumber || '',
      address: studentData.address || '',
      enrollmentDate: studentData.enrollmentDate || new Date().toISOString().split('T')[0],
      status: studentData.status || 'Active',
      grades: {
        midterm: studentData.grades?.midterm || 0,
        finals: studentData.grades?.finals || 0,
        average: studentData.grades?.average || 0
      },
      createdAt: new Date().toISOString()
    };

    return await db.post('students', newStudent);
  }

  // Update student
  static async update(id, data) {
    // Recalculate average if grades are updated
    if (data.grades) {
      const midterm = parseFloat(data.grades.midterm) || 0;
      const finals = parseFloat(data.grades.finals) || 0;
      data.grades.average = parseFloat(((midterm + finals) / 2).toFixed(2));
    }
    return await db.patch('students', id, data);
  }

  // Delete student
  static async delete(id) {
    return await db.delete('students', id);
  }

  // Get students by course
  static async findByCourse(course) {
    return await db.query('students', { course });
  }

  // Get students by section
  static async findBySection(section) {
    return await db.query('students', { section });
  }

  // Search students
  static async search(query) {
    const allStudents = await db.get('students');
    const q = query.toLowerCase();
    return allStudents.filter(s =>
      s.firstName.toLowerCase().includes(q) ||
      s.lastName.toLowerCase().includes(q) ||
      s.studentId.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) ||
      s.course.toLowerCase().includes(q)
    );
  }
}

module.exports = StudentModel;