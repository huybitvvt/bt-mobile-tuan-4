import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Avatar, Button, Icon, IconButton } from '../components/UI';
import { colors, common } from '../theme';

export default function StudentList({ students, t, notice, busy, onView, onAdd, onEdit, onDelete }) {
  return (
    <View style={common.page}>
      <View style={[common.content, common.section]}>
        <View style={styles.brandRow}>
          <View style={styles.brandIcon}><Icon name="users" color="#FFFFFF" size={24} /></View>
          <View style={common.fill}>
            <Text accessibilityRole="header" style={common.title}>{t('appName')}</Text>
            <Text style={common.subtitle}>{t('subtitle')}</Text>
          </View>
        </View>
        <View style={styles.sectionHeading}>
          <Text style={styles.listTitle}>{t('listTitle')}</Text>
          <Text style={styles.count}>{t('studentCount', { count: students.length })}</Text>
        </View>
      </View>
      {notice ? <Text accessibilityLiveRegion="polite" style={common.notice}>{t(notice)}</Text> : null}
      <FlatList data={students} keyExtractor={(item) => item.id}
        contentContainerStyle={[common.content, styles.list, !students.length && common.fill]}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Pressable accessibilityRole="button" accessibilityLabel={t('viewStudent', { name: item.fullName })}
              disabled={busy} onPress={() => onView(item)} style={({ pressed }) => [styles.student, pressed && styles.pressed]}>
              <Avatar uri={item.avatarUrl} name={item.fullName} />
              <View style={common.fill}>
                <Text style={styles.name}>{item.fullName}</Text>
                <Text style={styles.id}>{item.studentId}</Text>
                <Text numberOfLines={1} style={styles.email}>{item.email}</Text>
              </View>
            </Pressable>
            <View style={styles.actions}>
              <IconButton icon="edit-2" label={t('editNamed', { name: item.fullName })} disabled={busy} onPress={() => onEdit(item)} />
              <IconButton icon="trash-2" label={t('deleteNamed', { name: item.fullName })} danger disabled={busy} onPress={() => onDelete(item)} />
            </View>
          </View>
        )}
        ListEmptyComponent={(
          <View style={styles.empty}>
            <View style={styles.emptyIcon}><Icon name="users" size={34} color={colors.primary} /></View>
            <Text style={styles.emptyTitle}>{t('emptyTitle')}</Text>
            <Text style={styles.emptyText}>{t('emptyDescription')}</Text>
          </View>
        )}
      />
      <View style={common.footer}>
        <View style={common.content}><Button title={t('add')} icon="plus" onPress={onAdd} disabled={busy} /></View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  brandIcon: { width: 52, height: 52, borderRadius: 16, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  sectionHeading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginTop: 24 },
  listTitle: { flexShrink: 1, color: colors.text, fontSize: 17, fontWeight: '700' },
  count: { color: colors.primary, fontSize: 12, fontWeight: '600', paddingHorizontal: 10, paddingVertical: 6,
    backgroundColor: colors.primaryLight, borderRadius: 8 },
  list: { paddingHorizontal: 20, paddingBottom: 20, gap: 12 },
  card: { flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1, borderColor: colors.border,
    padding: 12, backgroundColor: colors.surface, borderRadius: 16 },
  student: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 72 },
  pressed: { opacity: 0.65 },
  name: { fontSize: 16, fontWeight: '600', color: colors.text },
  id: { fontSize: 13, fontWeight: '600', color: colors.primary, marginTop: 4 },
  email: { fontSize: 12, color: colors.muted, marginTop: 3 },
  actions: { gap: 6 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 40, paddingHorizontal: 24 },
  emptyIcon: { width: 88, height: 88, borderRadius: 28, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  emptyTitle: { fontSize: 21, fontWeight: '600', color: colors.text, textAlign: 'center' },
  emptyText: { fontSize: 15, lineHeight: 23, color: colors.muted, textAlign: 'center', marginTop: 8, maxWidth: 320 },
});
