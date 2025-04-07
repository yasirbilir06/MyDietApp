import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Platform,
  ScrollView
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { auth } from '../firebaseConfig';
import {
  getFirestore,
  doc,
  updateDoc,
  arrayUnion,
  setDoc,
  getDoc,
  onSnapshot,
} from 'firebase/firestore';
import moment from 'moment';

export default function AppointmentScreen() {
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [note, setNote] = useState('');
  const [appointments, setAppointments] = useState<any[]>([]);

  const formatDateReadable = (d: Date) => d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
  const formatTimeReadable = (d: Date) => d.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const newDate = new Date(date);
      newDate.setFullYear(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
      setDate(newDate);
    }
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const newDate = new Date(date);
      newDate.setHours(selectedTime.getHours());
      newDate.setMinutes(selectedTime.getMinutes());
      setDate(newDate);
    }
  };

  const fetchAppointments = () => {
    const user = auth.currentUser;
    if (!user) return;
    const db = getFirestore();
    const diyetisyenID = 'diyetisyen_uid'; // TODO: Dinamik hale getirilecek
    const docRef = doc(db, 'appointments', diyetisyenID);

    onSnapshot(docRef, (docSnap) => {
      const data = docSnap.data();
      if (data?.appointments) {
        const filtered = data.appointments.filter((r: any) => r.danisanID === user.uid);
        setAppointments(filtered);
      }
    });
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleCreateAppointment = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const db = getFirestore();
    const danisanID = user.uid;

    const userDoc = await getDoc(doc(db, 'users', danisanID));
    const danisanAdSoyad = userDoc.exists()
      ? `${userDoc.data().firstName} ${userDoc.data().lastName}`
      : 'Bilinmeyen';

    const diyetisyenID = 'diyetisyen_uid'; // TODO: Dinamik hale getirilecek
    const appointmentRef = doc(db, 'appointments', diyetisyenID);

    const formattedDate = moment(date).format('YYYY-MM-DD'); // ISO
    const formattedTime = moment(date).format('HH:mm');

    await setDoc(appointmentRef, {}, { merge: true });

    await updateDoc(appointmentRef, {
      appointments: arrayUnion({
        date: formattedDate,
        time: formattedTime,
        note,
        danisanAdSoyad,
        danisanID,
        createdAt: new Date(),
      })
    });

    setNote('');
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Randevu Al</Text>

      <TouchableOpacity style={styles.inputButton} onPress={() => setShowDatePicker(true)}>
        <Text style={styles.inputButtonText}>{formatDateReadable(date)}</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker value={date} mode="date" display={Platform.OS === 'ios' ? 'spinner' : 'default'} onChange={handleDateChange} />
      )}

      <TouchableOpacity style={styles.inputButton} onPress={() => setShowTimePicker(true)}>
        <Text style={styles.inputButtonText}>{formatTimeReadable(date)}</Text>
      </TouchableOpacity>
      {showTimePicker && (
        <DateTimePicker value={date} mode="time" is24Hour display={Platform.OS === 'ios' ? 'spinner' : 'default'} onChange={handleTimeChange} />
      )}

      <TextInput
        style={styles.noteInput}
        placeholder="Not ekleyin (isteğe bağlı)"
        value={note}
        onChangeText={setNote}
      />

      <TouchableOpacity style={styles.createButton} onPress={handleCreateAppointment}>
        <Text style={styles.createButtonText}>Randevu Oluştur</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Randevularım</Text>
      {appointments.map((item, index) => (
        <View key={index} style={styles.card}>
          <Text style={styles.cardTitle}>📌 {item.date} - {item.time}</Text>
          {item.note ? <Text>Not: {item.note}</Text> : null}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  header: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  inputButton: { backgroundColor: 'rgb(194,185,125)', borderRadius: 12, padding: 16, alignItems: 'center', marginBottom: 12 },
  inputButtonText: { color: '#fff', fontSize: 16 },
  noteInput: { borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 10, marginBottom: 20 },
  createButton: { backgroundColor: '#000', padding: 16, borderRadius: 12, alignItems: 'center' },
  createButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  sectionTitle: { fontSize: 20, fontWeight: '600', marginVertical: 16 },
  card: { backgroundColor: '#F5F5F5', padding: 12, borderRadius: 10, marginBottom: 10 },
  cardTitle: { fontWeight: 'bold', fontSize: 16, marginBottom: 4 },
});
