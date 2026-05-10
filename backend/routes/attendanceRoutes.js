const express = require('express');
const router = express.Router();
const {
  getAllAttendance,
  createAttendance,
  updateAttendance,
  deleteAttendance,
  getStudentSummary
} = require('../controllers/attendanceController');
const { protect } = require('../middleware/auth');

// All routes protected
router.use(protect);

router.get('/summary/:studentId', getStudentSummary);
router.get('/', getAllAttendance);
router.post('/', createAttendance);
router.patch('/:id', updateAttendance);
router.delete('/:id', deleteAttendance);

module.exports = router;