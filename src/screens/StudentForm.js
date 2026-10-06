import React, { useRef, useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Avatar, Button, Header } from '../components/UI';
import { cleanStudent, isUploadedAvatar, validateStudent } from '../studentModel';
import { pickAvatar } from '../pickAvatar';
import { colors, common } from '../theme';

const empty = { fullName: '', studentId: '', email: '', avatarUrl: '' };
const fields = [
  { name: 'fullName', placeholder: 'namePlaceholder', capitalization: 'words' },
  { name: 'studentId', placeholder: 'idPlaceholder', capitalization: 'characters' },
  { name: 'email', placeholder: 'emailPlaceholder', capitalization: 'none', keyboard: 'email-address' },
  { name: 'avatarUrl', placeholder: 'avatarPlaceholder', capitalization: 'none', keyboard: 'url' },
];

export default function StudentForm({ student, students, t, busy, failed, onBack, onSave }) {
  const [values, setValues] = useState(student ? cleanStudent(student) : empty);
  const [errors, setErrors] = useState({});
  const [avatarFailed, setAvatarFailed] = useState(false);
  const [picking, setPicking] = useState(false);
  const [pickError, setPickError] = useState(null);
  const pickingRef = useRef(false);
  const inputRefs = useRef({});
  const uploaded = isUploadedAvatar(values.avatarUrl);
  const locked = busy || picking;
  const changeAvatar = (uri) => {
    setValues((current) => ({ ...current, avatarUrl: uri }));
    setErrors((current) => ({ ...current, avatarUrl: undefined }));
    setAvatarFailed(false);
    setPickError(null);
  };
  const chooseAvatar = async () => {
    if (busy || pickingRef.current) return;
    pickingRef.current = true;
    setPicking(true);
    setPickError(null);
    try {
      const uri = await pickAvatar();
      if (uri) changeAvatar(uri);
    } catch (error) {
      setPickError(error.message === 'avatarPermission' ? 'avatarPermission' : 'avatarPickError');
    } finally {
      pickingRef.current = false;
      setPicking(false);
    }
  };
  const submit = () => {
    if (locked || pickingRef.current) return;
    const nextErrors = validateStudent(values, students, student?.id);
    setErrors(nextErrors);
    const firstError = fields.find((field) => nextErrors[field.name]);
    if (firstError) {
      inputRefs.current[firstError.name]?.focus();
      return;
    }
    Keyboard.dismiss();
    onSave(cleanStudent(values));
  };

  return (
    <View style={common.page}>
      <Header title={t(student ? 'editStudent' : 'newStudent')} t={t} onBack={onBack} disabled={locked} />
      <KeyboardAvoidingView style={common.fill} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={[common.content, styles.content]}>
          <View style={styles.preview}>
            <Avatar uri={values.avatarUrl.trim()} name={values.fullName} size={88} onError={() => setAvatarFailed(true)} />
            <Text style={styles.previewLabel}>{t('avatarPreview')}</Text>
            {avatarFailed ? <Text style={[common.error, styles.center]}>{t('avatarUnavailable')}</Text> : null}
          </View>
          <Text style={styles.formHint}>{t('formHint')}</Text>
          <View style={styles.formCard}>
            {fields.map((field, index) => (
              <View key={field.name} style={styles.field}>
                <Text style={styles.label}>{t(field.name === 'avatarUrl' ? 'avatar' : field.name)} <Text style={styles.required}>*</Text></Text>
                {field.name === 'avatarUrl' ? (
                  <View style={styles.avatarControls}>
                    <Button title={t(picking ? 'avatarPicking' : uploaded ? 'changeAvatar' : 'chooseAvatar')}
                      icon="upload" onPress={chooseAvatar} loading={picking} disabled={busy} />
                    {uploaded ? <Text style={styles.help}>{t('avatarDevice')}</Text>
                      : <Text style={styles.help}>{t('avatarOrUrl')}</Text>}
                    {uploaded ? <Button title={t('useAvatarUrl')} variant="secondary"
                      onPress={() => changeAvatar('')} disabled={locked} /> : null}
                    {pickError ? <Text accessibilityLiveRegion="assertive" style={common.error}>{t(pickError)}</Text> : null}
                  </View>
                ) : null}
                {field.name !== 'avatarUrl' || !uploaded ? <TextInput ref={(ref) => { inputRefs.current[field.name] = ref; }}
                  accessibilityLabel={t(field.name)} accessibilityHint={errors[field.name] ? t(errors[field.name]) : undefined}
                  editable={!locked} value={values[field.name]}
                  onChangeText={(value) => {
                    if (field.name === 'avatarUrl') { changeAvatar(value); return; }
                    setValues((current) => ({ ...current, [field.name]: value }));
                    setErrors((current) => ({ ...current, [field.name]: undefined }));
                  }}
                  style={[styles.input, errors[field.name] && styles.invalid]}
                  placeholder={t(field.placeholder)} placeholderTextColor={colors.muted}
                  autoCapitalize={field.capitalization} autoCorrect={false}
                  keyboardType={field.keyboard || 'default'} returnKeyType={index === 3 || (index === 2 && uploaded) ? 'done' : 'next'}
                  submitBehavior={index === 3 || (index === 2 && uploaded) ? 'blurAndSubmit' : 'submit'}
                  onSubmitEditing={() => {
                    if (index === 3 || (index === 2 && uploaded)) submit();
                    else inputRefs.current[fields[index + 1].name]?.focus();
                  }} /> : null}
                {field.name === 'avatarUrl' && !uploaded ? <Text style={styles.help}>{t('avatarHelp')}</Text> : null}
                {errors[field.name] ? <Text accessibilityLiveRegion="polite" style={common.error}>{t(errors[field.name])}</Text> : null}
              </View>
            ))}
          </View>
          {failed ? <Text accessibilityLiveRegion="assertive" style={common.error}>{t('saveError')}</Text> : null}
          <View style={styles.save}><Button title={busy ? t('saving') : t(student ? 'saveChanges' : 'save')}
            icon="check" loading={busy} onPress={submit} disabled={picking} /></View>
          <Button title={t('cancel')} variant="secondary" onPress={onBack} disabled={locked} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, paddingBottom: 28 },
  preview: { alignItems: 'center', paddingVertical: 12 },
  previewLabel: { fontSize: 12, color: colors.muted, marginTop: 10 },
  center: { textAlign: 'center' },
  formHint: { fontSize: 14, color: colors.muted, lineHeight: 21, marginTop: 12, marginBottom: 20 },
  formCard: { borderRadius: 16, padding: 18, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  field: { marginBottom: 18 },
  label: { fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: 8 },
  required: { color: colors.danger },
  input: { minHeight: 50, borderWidth: 1, borderColor: '#98A8B3', borderRadius: 10, paddingHorizontal: 12,
    paddingVertical: 12, fontSize: 15, color: colors.text, backgroundColor: colors.surface },
  invalid: { borderColor: colors.danger },
  help: { fontSize: 12, color: colors.muted, lineHeight: 18, marginTop: 6 },
  avatarControls: { gap: 10, marginBottom: 12 },
  save: { marginTop: 24, marginBottom: 12 },
});
