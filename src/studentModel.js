export const STORAGE_KEY = '@bt-mobile-tuan-4/students:v1';

export function isUploadedAvatar(uri) {
  return typeof uri === 'string' && uri.length <= 128 * 1024
    && /^data:image\/jpeg;base64,\/9j\/[A-Za-z0-9+/]*={0,2}$/.test(uri)
    && uri.slice(uri.indexOf(',') + 1).length % 4 === 0;
}

export function cleanStudent(values) {
  return Object.fromEntries(['fullName', 'studentId', 'email', 'avatarUrl'].map(
    (field) => [field, String(values[field] || '').trim()],
  ));
}

export function validateStudent(values, students, editingId = null) {
  const student = cleanStudent(values);
  const errors = {};
  if (!student.fullName) errors.fullName = 'nameRequired';
  if (!student.studentId) {
    errors.studentId = 'idRequired';
  } else if (students.some((item) => item.id !== editingId
    && item.studentId.toLowerCase() === student.studentId.toLowerCase())) {
    errors.studentId = 'idDuplicate';
  }
  if (!student.email) errors.email = 'emailRequired';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(student.email)) errors.email = 'emailInvalid';
  if (!student.avatarUrl) errors.avatarUrl = 'avatarRequired';
  else if (!isUploadedAvatar(student.avatarUrl)
    && !/^https?:\/\/[^\s/?#]+(?:[/?#][^\s]*)?$/i.test(student.avatarUrl)) errors.avatarUrl = 'avatarInvalid';
  return errors;
}

export function decodeStudents(raw) {
  if (raw === null) return [];
  const students = JSON.parse(raw);
  const fields = ['id', 'fullName', 'studentId', 'email', 'avatarUrl'];
  if (!Array.isArray(students) || students.some((student) => !student
    || fields.some((field) => typeof student[field] !== 'string' || !student[field].trim()))) {
    throw new Error('Invalid student storage');
  }
  if (new Set(students.map((student) => student.id)).size !== students.length
    || new Set(students.map((student) => student.studentId.trim().toLowerCase())).size !== students.length) {
    throw new Error('Duplicate student storage');
  }
  return students;
}
