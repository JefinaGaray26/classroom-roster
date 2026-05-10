const StudentModel = require('../models/Student');

// GET /api/students
const getAllStudents = async (req, res) => {
  try {
    const { course, section, status, search } = req.query;
    let students;

    if (search) {
      students = await StudentModel.search(search);
    } else if (course || section || status) {
      const filters = {};
      if (course) filters.course = course;
      if (section) filters.section = section;
      if (status) filters.status = status;
      students = await StudentModel.findAll(filters);
    } else {
      students = await StudentModel.findAll();
    }

    res.status(200).json({
      success: true,
      count: students.length,
      data: students
    });
  } catch (error) {
    console.error('Get students error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch students.'
    });
  }
};

// GET /api/students/:id
const getStudentById = async (req, res) => {
  try {
    const student = await StudentModel.findById(req.params.id);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found.'
      });
    }
    res.status(200).json({ success: true, data: student });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch student.'
    });
  }
};

// POST /api/students
const createStudent = async (req, res) => {
  try {
    const { firstName, lastName, email, course, year, section, gender } = req.body;

    if (!firstName || !lastName || !email || !course || !year || !section || !gender) {
      return res.status(400).json({
        success: false,
        message: 'Required fields: firstName, lastName, email, course, year, section, gender.'
      });
    }

    // Check duplicate email
    const existing = await StudentModel.findByEmail(email);
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'A student with this email already exists.'
      });
    }

    const student = await StudentModel.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Student added successfully!',
      data: student
    });
  } catch (error) {
    console.error('Create student error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to create student.'
    });
  }
};

// PUT /api/students/:id
const updateStudent = async (req, res) => {
  try {
    const existing = await StudentModel.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Student not found.'
      });
    }

    const updated = await StudentModel.update(req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: 'Student updated successfully!',
      data: updated
    });
  } catch (error) {
    console.error('Update student error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to update student.'
    });
  }
};

// DELETE /api/students/:id
const deleteStudent = async (req, res) => {
  try {
    const existing = await StudentModel.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Student not found.'
      });
    }

    await StudentModel.delete(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Student deleted successfully.'
    });
  } catch (error) {
    console.error('Delete student error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to delete student.'
    });
  }
};

// GET /api/students/stats/summary
const getStats = async (req, res) => {
  try {
    const students = await StudentModel.findAll();
    const active = students.filter(s => s.status === 'Active').length;
    const inactive = students.filter(s => s.status === 'Inactive').length;

    const courses = [...new Set(students.map(s => s.course))];
    const courseBreakdown = courses.map(c => ({
      course: c,
      count: students.filter(s => s.course === c).length
    }));

    const grades = students.map(s => s.grades?.average || 0).filter(g => g > 0);
    const avgGrade = grades.length > 0
      ? (grades.reduce((a, b) => a + b, 0) / grades.length).toFixed(2)
      : 0;

    res.status(200).json({
      success: true,
      data: {
        total: students.length,
        active,
        inactive,
        courseBreakdown,
        averageGrade: parseFloat(avgGrade)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get stats.'
    });
  }
};

module.exports = {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  getStats
};