const test = require('node:test');
const assert = require('node:assert/strict');
const loadSource = require('./loadSource.cjs');
const { cleanStudent, validateStudent, decodeStudents, isUploadedAvatar } = loadSource('src/studentModel.js');
const record = { id: 'student-1', fullName: 'Nguyễn Minh An', studentId: 'BIT240115',
  email: 'an@example.com', avatarUrl: 'https://example.com/an.jpg' };

test('All four student fields are required, including whitespace-only values', () => {
  assert.deepEqual(validateStudent({ fullName: ' ', studentId: ' ', email: ' ', avatarUrl: ' ' }, []), {
    fullName: 'nameRequired', studentId: 'idRequired', email: 'emailRequired', avatarUrl: 'avatarRequired',
  });
});

test('Trim values without modifying the student name', () => {
  assert.deepEqual(cleanStudent({ ...record, fullName: '  Nguyễn Minh An  ', email: ' an@example.com ' }), {
    fullName: record.fullName, studentId: record.studentId, email: record.email, avatarUrl: record.avatarUrl,
  });
});

test('Reject duplicate student IDs regardless of case, but allow editing the same record', () => {
  assert.equal(validateStudent({ ...record, studentId: 'bit240115' }, [record]).studentId, 'idDuplicate');
  assert.deepEqual(validateStudent(record, [record], record.id), {});
});

test('Validate email and avatar link separately', () => {
  for (const email of ['an', 'an@', 'an@example', 'an @example.com']) {
    assert.equal(validateStudent({ ...record, email }, []).email, 'emailInvalid');
  }
  for (const avatarUrl of ['file:///image.jpg', 'javascript:alert(1)', 'https://', 'https://example.com/a b.jpg']) {
    assert.equal(validateStudent({ ...record, avatarUrl }, []).avatarUrl, 'avatarInvalid');
  }
  assert.deepEqual(validateStudent(record, []), {});
  assert.deepEqual(validateStudent({ ...record, avatarUrl: 'http://example.com/an.png' }, []), {});
});

test('Load empty storage and round-trip full records', () => {
  assert.deepEqual(decodeStudents(null), []);
  assert.deepEqual(decodeStudents(JSON.stringify([record])), [record]);
});

test('Uploaded JPEG avatars validate and survive the storage round-trip; temporary file URIs do not', () => {
  const uploaded = { ...record, avatarUrl: 'data:image/jpeg;base64,/9j/2Q==' };
  assert.ok(isUploadedAvatar(uploaded.avatarUrl));
  assert.deepEqual(validateStudent(uploaded, []), {});
  assert.deepEqual(decodeStudents(JSON.stringify([uploaded])), [uploaded]);
  for (const avatarUrl of ['blob:temporary', 'file:///cache/avatar.jpg', 'data:text/html;base64,AAAA',
    'data:image/jpeg;base64,', 'data:image/jpeg;base64,/9j/!',
    `data:image/jpeg;base64,/9j/${'A'.repeat(128 * 1024)}`]) {
    assert.equal(isUploadedAvatar(avatarUrl), false);
    assert.equal(validateStudent({ ...record, avatarUrl }, []).avatarUrl, 'avatarInvalid');
  }
});

test('Corrupt or incomplete stored data is rejected instead of silently replacing it', () => {
  for (const raw of ['{', '{}', 'null', '[null]', JSON.stringify([{ id: '1' }]), JSON.stringify([{ ...record, email: '' }])]) {
    assert.throws(() => decodeStudents(raw));
  }
  assert.throws(() => decodeStudents(JSON.stringify([record, record])));
  assert.throws(() => decodeStudents(JSON.stringify([record, { ...record, id: '2', studentId: 'bit240115' }])));
});
