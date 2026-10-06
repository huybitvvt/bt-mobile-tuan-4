import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, BackHandler, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import StudentList from './src/screens/StudentList';
import StudentDetails from './src/screens/StudentDetails';
import StudentForm from './src/screens/StudentForm';
import { Button, Confirmation } from './src/components/UI';
import { useStudents } from './src/useStudents';
import { useTranslation } from './src/i18n';
import { validateStudent } from './src/studentModel';
import { colors, common } from './src/theme';

function StudentManager() {
  const { t, language } = useTranslation();
  const { students, loading, loadError, saving, load, persist } = useStudents();
  const [route, setRoute] = useState({ name: 'list' });
  const [confirmation, setConfirmation] = useState(null);
  const [saveFailed, setSaveFailed] = useState(false);
  const [notice, setNotice] = useState(null);
  const commitBusy = useRef(false);
  const selected = students.find((student) => student.id === route.id);

  const back = () => {
    if (saving) return;
    setSaveFailed(false);
    setNotice(null);
    if (confirmation) setConfirmation(null);
    else if (route.name === 'form' && route.returnTo === 'details') setRoute({ name: 'details', id: route.id });
    else setRoute({ name: 'list' });
  };

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.title = t('appName');
      document.documentElement.lang = language;
    }
  }, [language]);

  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      if (saving) return true;
      if (route.name !== 'list' || confirmation) { back(); return true; }
      return false;
    });
    return () => subscription.remove();
  }, [route, confirmation, saving]);

  const openForm = (student, returnTo = 'list') => {
    setNotice(null);
    setSaveFailed(false);
    setRoute({ name: 'form', id: student?.id, returnTo });
  };

  const requestDelete = (student) => {
    setSaveFailed(false);
    setConfirmation({ type: 'delete', student });
  };

  const commit = async (action) => {
    if (commitBusy.current) return;
    commitBusy.current = true;
    setSaveFailed(false);
    try {
      const success = await persist((current) => {
        if (action.type === 'delete') return current.filter((item) => item.id !== action.student.id);
        if (Object.keys(validateStudent(action.student, current, action.type === 'edit' ? action.student.id : null)).length) {
          throw new Error('Invalid or duplicate student');
        }
        if (action.type === 'edit') {
          if (!current.some((item) => item.id === action.student.id)) throw new Error('Student no longer exists');
          return current.map((item) => item.id === action.student.id ? action.student : item);
        }
        return [...current, action.student];
      });
      if (!success) return;
      setConfirmation(null);
      setNotice(action.type === 'add' ? 'created' : action.type === 'edit' ? 'updated' : 'deleted');
      setRoute(action.type === 'delete' ? { name: 'list' } : { name: 'details', id: action.student.id });
    } catch {
      setSaveFailed(true);
    } finally {
      commitBusy.current = false;
    }
  };

  const save = (values) => {
    if (selected) setConfirmation({ type: 'edit', student: { ...values, id: selected.id } });
    else commit({ type: 'add', student: { ...values, id: `${Date.now()}-${Math.random().toString(36).slice(2, 10)}` } });
  };

  let screen;
  if (loading || loadError) {
    screen = (
      <View style={styles.loading}>
        <Text accessibilityRole="header" style={common.title}>{t('appName')}</Text>
        {loading ? <ActivityIndicator size="large" color={colors.primary} style={styles.spinner} /> : null}
        <Text style={styles.loadingText}>{t(loading ? 'loading' : 'loadError')}</Text>
        {loadError && !loading ? <Button title={t('retry')} onPress={load} /> : null}
      </View>
    );
  } else if (route.name === 'form') {
    screen = <StudentForm key={route.id || 'new'} student={selected} students={students} t={t}
      busy={saving} failed={saveFailed} onBack={back} onSave={save} />;
  } else if (route.name === 'details' && selected) {
    screen = <StudentDetails student={selected} t={t} busy={saving} notice={notice} onBack={back}
      onEdit={() => openForm(selected, 'details')} onDelete={() => requestDelete(selected)} />;
  } else {
    screen = <StudentList students={students} t={t} busy={saving} notice={notice}
      onView={(student) => { setNotice(null); setRoute({ name: 'details', id: student.id }); }}
      onAdd={() => openForm()} onEdit={openForm} onDelete={requestDelete} />;
  }

  return (
    <SafeAreaView style={common.fill}>
      <StatusBar style="dark" />
      {screen}
      <Confirmation action={confirmation} t={t} saving={saving} failed={saveFailed}
        onCancel={() => { setConfirmation(null); setSaveFailed(false); }}
        onConfirm={() => { if (confirmation) commit(confirmation); }} />
    </SafeAreaView>
  );
}

export default function App() {
  return <SafeAreaProvider><StudentManager /></SafeAreaProvider>;
}

const styles = StyleSheet.create({
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 28, gap: 20, backgroundColor: colors.background },
  spinner: { marginTop: 12 },
  loadingText: { color: colors.muted, fontSize: 15, lineHeight: 24, textAlign: 'center', maxWidth: 400 },
});
