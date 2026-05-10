const db = require('../config/db');

class AttendanceModel {
  static async findAll() {
    return await db.get('attendance');
  }

  static async findById(id) {
    return await db.getById('attendance', id);
  }

  static async findByStudent(studentId) {
    return await db.query('attendance', { studentId });
  }

  static async findByDate(date) {
    return await db.query('attendance', { date });
  }

  static async create(data) {
    const record = {
      studentId: parseInt(data.studentId),
      date: data.date,
      status: data.status,
      remarks: data.remarks || '',
      createdAt: new Date().toISOString()
    };
    return await db.post('attendance', record);
  }

  static async update(id, data) {
    return await db.patch('attendance', id, data);
  }

  static async delete(id) {
    return await db.delete('attendance', id);
  }

  static async getStudentSummary(studentId) {
    const records = await db.query('attendance', { studentId });
    const total = records.length;
    const present = records.filter(r => r.status === 'Present').length;
    const absent = records.filter(r => r.status === 'Absent').length;
    const late = records.filter(r => r.status === 'Late').length;
    return {
      total,
      present,
      absent,
      late,
      percentage: total > 0 ? ((present / total) * 100).toFixed(1) : 0
    };
  }
}

module.exports = AttendanceModel;