import { useCallback, useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { decodeStudents, STORAGE_KEY } from './studentModel';

export function useStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [saving, setSaving] = useState(false);
  const studentsRef = useRef([]);
  const busyRef = useRef(false);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(false);
    try {
      const records = decodeStudents(await AsyncStorage.getItem(STORAGE_KEY));
      studentsRef.current = records;
      setStudents(records);
    } catch {
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const persist = async (transform) => {
    if (busyRef.current || loading || loadError) return false;
    busyRef.current = true;
    setSaving(true);
    try {
      const next = transform(studentsRef.current);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      studentsRef.current = next;
      setStudents(next);
      return true;
    } finally {
      busyRef.current = false;
      setSaving(false);
    }
  };

  return { students, loading, loadError, saving, load, persist };
}
