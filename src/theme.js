import { StyleSheet } from 'react-native';

export const colors = {
  primary: '#0F766E',
  primaryLight: '#E6F5F1',
  background: '#F6F8FA',
  surface: '#FFFFFF',
  text: '#152A36',
  muted: '#556775',
  border: '#D8E0E5',
  danger: '#B42318',
  dangerLight: '#FFF1F0',
};

export const common = StyleSheet.create({
  fill: { flex: 1 },
  content: { width: '100%', maxWidth: 720, alignSelf: 'center' },
  page: { flex: 1, backgroundColor: colors.background },
  section: { padding: 20 },
  title: { color: colors.text, fontSize: 28, fontWeight: '700' },
  subtitle: { color: colors.muted, fontSize: 14, lineHeight: 21, marginTop: 6 },
  footer: { padding: 16, borderTopWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  notice: { color: colors.primary, fontSize: 14, paddingHorizontal: 20, paddingVertical: 12, backgroundColor: colors.primaryLight },
  error: { color: colors.danger, fontSize: 13, lineHeight: 20, marginTop: 6 },
});
