import { useEffect, useState } from 'react';
import { AppState } from 'react-native';
import { getLocales } from 'expo-localization';

export const messages = {
  vi: {
    appName: 'Quản lý sinh viên',
    subtitle: 'Thông tin sinh viên, luôn trong tầm tay.',
    listTitle: 'Danh sách sinh viên',
    studentCount: '{count} sinh viên',
    search: 'Tìm tên, MSSV hoặc email',
    add: 'Thêm sinh viên',
    edit: 'Sửa thông tin',
    delete: 'Xóa sinh viên',
    details: 'Thông tin sinh viên',
    newStudent: 'Thêm sinh viên mới',
    editStudent: 'Sửa thông tin sinh viên',
    formHint: 'Điền đầy đủ thông tin bên dưới để lưu hồ sơ.',
    fullName: 'Họ tên SV',
    studentId: 'Mã số SV',
    email: 'Email',
    avatarUrl: 'Link ảnh avatar',
    namePlaceholder: 'Ví dụ: Nguyễn Doãn Huy',
    idPlaceholder: 'Ví dụ: BIT240115',
    emailPlaceholder: 'Ví dụ: huy@example.com',
    avatarPlaceholder: 'https://example.com/avatar.jpg',
    avatarHelp: 'Dán link ảnh bắt đầu bằng http:// hoặc https://.',
    avatarPreview: 'Ảnh xem trước',
    avatarUnavailable: 'Không tải được ảnh. Kiểm tra link hoặc kết nối mạng.',
    save: 'Lưu sinh viên',
    saveChanges: 'Lưu thay đổi',
    saving: 'Đang lưu…',
    cancel: 'Hủy',
    back: 'Quay lại',
    emptyTitle: 'Chưa có sinh viên',
    emptyDescription: 'Thêm sinh viên đầu tiên để bắt đầu quản lý danh sách.',
    noResults: 'Không tìm thấy sinh viên',
    noResultsDescription: 'Thử tìm bằng tên, mã số hoặc email khác.',
    confirmEditTitle: 'Xác nhận sửa',
    confirmDeleteTitle: 'Xác nhận xóa',
    confirmEdit: 'Bạn có muốn sửa thông tin SV không?',
    confirmDelete: 'Bạn có muốn xóa thông tin SV không?',
    yes: 'Có',
    no: 'Không',
    loading: 'Đang tải danh sách…',
    loadError: 'Không đọc được dữ liệu đã lưu. Hãy thử lại; dữ liệu hiện có sẽ được giữ nguyên.',
    saveError: 'Không lưu được thay đổi. Dữ liệu chưa thay đổi, vui lòng thử lại.',
    retry: 'Thử lại',
    created: 'Đã thêm sinh viên.',
    updated: 'Đã cập nhật thông tin sinh viên.',
    deleted: 'Đã xóa sinh viên.',
    nameRequired: 'Vui lòng nhập họ tên sinh viên.',
    idRequired: 'Vui lòng nhập mã số sinh viên.',
    idDuplicate: 'Mã số sinh viên đã tồn tại.',
    emailRequired: 'Vui lòng nhập email.',
    emailInvalid: 'Email không đúng định dạng.',
    avatarRequired: 'Vui lòng nhập link ảnh avatar.',
    avatarInvalid: 'Link ảnh phải bắt đầu bằng http:// hoặc https:// và không chứa dấu cách.',
    viewStudent: 'Xem thông tin {name}',
    editNamed: 'Sửa thông tin {name}',
    deleteNamed: 'Xóa sinh viên {name}',
  },
  en: {
    appName: 'Student Manager',
    subtitle: 'Student records, always at your fingertips.',
    listTitle: 'Student list',
    studentCount: 'Students: {count}',
    search: 'Search name, student ID or email',
    add: 'Add student',
    edit: 'Edit details',
    delete: 'Delete student',
    details: 'Student details',
    newStudent: 'Add a new student',
    editStudent: 'Edit student details',
    formHint: 'Complete all fields below to save this record.',
    fullName: 'Full name',
    studentId: 'Student ID',
    email: 'Email',
    avatarUrl: 'Avatar image URL',
    namePlaceholder: 'Example: Nguyen Doan Huy',
    idPlaceholder: 'Example: BIT240115',
    emailPlaceholder: 'Example: huy@example.com',
    avatarPlaceholder: 'https://example.com/avatar.jpg',
    avatarHelp: 'Paste an image URL starting with http:// or https://.',
    avatarPreview: 'Avatar preview',
    avatarUnavailable: 'Image could not load. Check the URL or your connection.',
    save: 'Save student',
    saveChanges: 'Save changes',
    saving: 'Saving…',
    cancel: 'Cancel',
    back: 'Back',
    emptyTitle: 'No students yet',
    emptyDescription: 'Add your first student to start managing your list.',
    noResults: 'No students found',
    noResultsDescription: 'Try another name, student ID or email.',
    confirmEditTitle: 'Confirm update',
    confirmDeleteTitle: 'Confirm deletion',
    confirmEdit: 'Do you want to update this student’s information?',
    confirmDelete: 'Do you want to delete this student’s information?',
    yes: 'Yes',
    no: 'No',
    loading: 'Loading students…',
    loadError: 'Stored data could not be read. Try again; existing data will be kept.',
    saveError: 'Changes could not be saved. Your data has not changed; please try again.',
    retry: 'Try again',
    created: 'Student added.',
    updated: 'Student details updated.',
    deleted: 'Student deleted.',
    nameRequired: 'Enter the student’s full name.',
    idRequired: 'Enter the student ID.',
    idDuplicate: 'This student ID already exists.',
    emailRequired: 'Enter an email address.',
    emailInvalid: 'Enter a valid email address.',
    avatarRequired: 'Enter an avatar image URL.',
    avatarInvalid: 'Use an http:// or https:// image URL without spaces.',
    viewStudent: 'View {name}',
    editNamed: 'Edit {name}',
    deleteNamed: 'Delete {name}',
  },
};

export function deviceLanguage() {
  return getLocales()[0]?.languageCode === 'vi' ? 'vi' : 'en';
}

export function useTranslation() {
  const [language, setLanguage] = useState(deviceLanguage);
  useEffect(() => {
    const update = () => setLanguage(deviceLanguage());
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') update();
    });
    if (typeof window !== 'undefined') window.addEventListener('languagechange', update);
    return () => {
      subscription.remove();
      if (typeof window !== 'undefined') window.removeEventListener('languagechange', update);
    };
  }, []);
  const t = (key, params = {}) => Object.entries(params).reduce(
    (text, [name, value]) => text.replace(`{${name}}`, String(value)),
    messages[language][key] || key,
  );
  return { t, language };
}
