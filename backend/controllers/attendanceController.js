const AttendanceModel = require('../models/Attendance');
const StudentModel = require('../models/Student');

// GET /api/attendance
const getAllAttendance = async (req, res) => {
  try {
    const { studentId, date } = req.query;
    let records;

    if (studentId) {
      records = await AttendanceModel.findByStudent(parseInt(studentId));
    } else if (date) {
      records = await AttendanceModel.findByDate(date);
    } else {
      records = await AttendanceModel.findAll();
    }

    res.status(200).json({
      success: true,
      count: records.length,
      data: records
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch attendance.'
    });
  }
};

// POST /api/attendance
const createAttendance = async (req, res) => {
  try {
    const { studentId, date, status } = req.body;

    if (!studentId || !date || !status) {
      return res.status(400).json({
        success: false,
        message: 'studentId, date, and status are required.'
      });
    }

    const student = await StudentModel.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found.'
      });
    }

    const record = await AttendanceModel.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Attendance recorded!',
      data: record
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to record attendance.'
    });
  }
};

// PATCH /api/attendance/:id
const updateAttendance = async (req, res) => {
  try {
    const existing = await AttendanceModel.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Attendance record not found.'
      });
    }

    const updated = await AttendanceModel.update(req.params.id, req.body);
    res.status(200).json({
      success: true,
      data: updated
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update attendance.'
    });
  }
};

// DELETE /api/attendance/:id
const deleteAttendance = async (req, res) => {
  try {
    const existing = await AttendanceModel.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Record not found.'
      });
    }

    await AttendanceModel.delete(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Attendance record deleted.'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete record.'
    });
  }
};

// GET /api/attendance/summary/:studentId
const getStudentSummary = async (req, res) => {
  try {
    const summary = await AttendanceModel.getStudentSummary(
      parseInt(req.params.studentId)
    );
    res.status(200).json({
      success: true,
      data: summary
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get summary.'
    });
  }
};

module.exports = {
  getAllAttendance,
  createAttendance,
  updateAttendance,
  deleteAttendance,
  getStudentSummary
};