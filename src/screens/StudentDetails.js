import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Avatar, Button, Header, Icon } from '../components/UI';
import { colors, common } from '../theme';

export default function StudentDetails({ student, t, busy, notice, onBack, onEdit, onDelete }) {
  return (
    <View style={common.page}>
      <Header title={t('details')} t={t} onBack={onBack} disabled={busy} />
      {notice ? <Text accessibilityLiveRegion="polite" style={common.notice}>{t(notice)}</Text> : null}
      <ScrollView contentContainerStyle={[common.content, styles.content]}>
        <View style={styles.profile}>
          <Avatar uri={student.avatarUrl} name={student.fullName} size={112} />
          <Text style={styles.name}>{student.fullName}</Text>
          <Text style={styles.badge}>{student.studentId}</Text>
        </View>
        <View style={styles.infoCard}>
          {[['user', 'fullName'], ['hash', 'studentId'], ['mail', 'email'], ['image', 'avatarUrl']].map(([icon, field]) => (
            <View key={field} style={styles.infoRow}>
              <View style={styles.infoIcon}><Icon name={icon} color={colors.primary} /></View>
              <View style={common.fill}>
                <Text style={styles.label}>{t(field)}</Text>
                <Text selectable style={styles.value}>{student[field]}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
      <View style={common.footer}>
        <View style={[common.content, common.row]}>
          <View style={common.fill}><Button title={t('edit')} icon="edit-2" onPress={onEdit} disabled={busy} /></View>
          <View style={common.fill}><Button title={t('delete')} icon="trash-2" variant="danger" onPress={onDelete} disabled={busy} /></View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, paddingBottom: 32 },
  profile: { alignItems: 'center', paddingVertical: 24 },
  name: { fontSize: 26, fontWeight: '700', color: colors.text, textAlign: 'center', marginTop: 18 },
  badge: { fontSize: 14, fontWeight: '600', color: colors.primary, paddingHorizontal: 14, paddingVertical: 8,
    backgroundColor: colors.primaryLight, borderRadius: 8, marginTop: 12 },
  infoCard: { borderRadius: 16, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 16 },
  infoRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 14, paddingVertical: 18 },
  infoIcon: { paddingTop: 3 },
  label: { fontSize: 12, color: colors.muted, marginBottom: 6 },
  value: { fontSize: 16, lineHeight: 24, color: colors.text },
});
