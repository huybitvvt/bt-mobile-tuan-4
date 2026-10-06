import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { colors, common } from '../theme';

export function Icon({ name, size = 20, color = colors.text }) {
  return <Feather name={name} size={size} color={color} accessible={false} />;
}

export function Button({ title, onPress, icon, variant = 'primary', disabled, loading }) {
  const primary = variant === 'primary';
  const danger = variant === 'danger';
  const foreground = primary ? '#FFFFFF' : danger ? colors.danger : colors.text;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: Boolean(disabled || loading), busy: Boolean(loading) }}
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [styles.button, primary && styles.primaryButton,
        danger && styles.dangerButton, (pressed || disabled || loading) && styles.dimmed]}
    >
      {loading ? <ActivityIndicator color={foreground} /> : icon ? <Icon name={icon} color={foreground} /> : null}
      <Text style={[styles.buttonText, { color: foreground }]}>{title}</Text>
    </Pressable>
  );
}

export function IconButton({ icon, label, onPress, danger = false, disabled }) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label}
      disabled={disabled} accessibilityState={{ disabled: Boolean(disabled) }} onPress={onPress}
      style={({ pressed }) => [styles.iconButton, danger && styles.dangerButton,
        (pressed || disabled) && styles.dimmed]}>
      <Icon name={icon} color={danger ? colors.danger : colors.primary} />
    </Pressable>
  );
}

export function Header({ title, t, onBack, disabled }) {
  return (
    <View style={styles.header}>
      <IconButton icon="arrow-left" label={t('back')} onPress={onBack} disabled={disabled} />
      <Text accessibilityRole="header" style={styles.headerTitle}>{title}</Text>
    </View>
  );
}

export function Avatar({ uri, name = '', size = 56, onError }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => { setFailed(false); }, [uri]);
  const initials = name.trim().split(/\s+/).slice(-2).map((word) => word[0] || '').join('').toUpperCase();
  return (
    <View style={[styles.avatar, { width: size, height: size, borderRadius: size / 3 }]}>
      {uri && !failed ? (
        <Image source={{ uri }} accessibilityLabel={name} style={styles.avatarImage}
          onError={() => { setFailed(true); onError?.(); }} />
      ) : initials ? (
        <Text style={[styles.initials, { fontSize: size / 3 }]}>{initials}</Text>
      ) : <Icon name="user" size={size / 2} color={colors.primary} />}
    </View>
  );
}

export function Confirmation({ action, t, saving, failed, onCancel, onConfirm }) {
  const deleting = action?.type === 'delete';
  return (
    <Modal visible={Boolean(action)} transparent animationType="fade"
      onRequestClose={() => { if (!saving) onCancel(); }}>
      <View style={styles.overlay}>
        <View accessibilityViewIsModal style={styles.dialog}>
          <View style={[styles.dialogIcon, deleting && styles.dangerButton]}>
            <Icon name={deleting ? 'trash-2' : 'edit-3'} size={26}
              color={deleting ? colors.danger : colors.primary} />
          </View>
          <Text accessibilityRole="header" style={styles.dialogTitle}>
            {t(deleting ? 'confirmDeleteTitle' : 'confirmEditTitle')}
          </Text>
          <Text style={styles.dialogBody}>{t(deleting ? 'confirmDelete' : 'confirmEdit')}</Text>
          <Text style={styles.dialogName}>{action?.student?.fullName || ''}</Text>
          {failed ? <Text accessibilityLiveRegion="assertive" style={common.error}>{t('saveError')}</Text> : null}
          <View style={styles.dialogActions}>
            <View style={common.fill}><Button title={t('no')} variant="secondary" onPress={onCancel} disabled={saving} /></View>
            <View style={common.fill}><Button title={saving ? t('saving') : t('yes')}
              variant={deleting ? 'danger' : 'primary'} loading={saving} onPress={onConfirm} /></View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  button: { minHeight: 50, borderRadius: 12, paddingHorizontal: 20, paddingVertical: 14,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: '#EDF1F4' },
  primaryButton: { backgroundColor: colors.primary },
  dangerButton: { backgroundColor: colors.dangerLight },
  buttonText: { fontSize: 15, fontWeight: '600', textAlign: 'center', flexShrink: 1 },
  dimmed: { opacity: 0.6 },
  iconButton: { width: 48, height: 48, borderRadius: 12, backgroundColor: colors.primaryLight,
    alignItems: 'center', justifyContent: 'center' },
  header: { padding: 16, gap: 12, flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface,
    borderBottomWidth: 1, borderColor: colors.border },
  headerTitle: { flex: 1, fontSize: 19, fontWeight: '600', color: colors.text },
  avatar: { overflow: 'hidden', backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center' },
  avatarImage: { width: '100%', height: '100%' },
  initials: { color: colors.primary, fontWeight: '700' },
  overlay: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.5)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  dialog: { width: '100%', maxWidth: 400, backgroundColor: colors.surface, borderRadius: 20, padding: 24 },
  dialogIcon: { width: 56, height: 56, borderRadius: 16, backgroundColor: colors.primaryLight,
    alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  dialogTitle: { fontSize: 21, fontWeight: '700', color: colors.text },
  dialogBody: { marginTop: 10, fontSize: 16, lineHeight: 24, color: colors.muted },
  dialogName: { marginTop: 8, fontSize: 15, fontWeight: '600', color: colors.text },
  dialogActions: { flexDirection: 'row', gap: 12, marginTop: 24 },
});
