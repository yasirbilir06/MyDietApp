import React, { useState, useEffect, memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  StatusBar
} from 'react-native';
import CustomTextInput from '../components/CustomTextInput';
import { Calendar, LocaleConfig, DateData } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';
import { auth } from '../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

// 🔢 Yaş hesaplama
function calculateAge(birthDate: string): number | null {
  if (!birthDate) return null;
  const parts = birthDate.split('.');
  if (parts.length !== 3) return null;
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const year = parseInt(parts[2], 10);
  const dob = new Date(year, month, day);
  if (isNaN(dob.getTime())) return null;
  const diff = Date.now() - dob.getTime();
  const ageDate = new Date(diff);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

// 📅 Türkçe takvim
LocaleConfig.locales['tr'] = {
  monthNames: ['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'],
  monthNamesShort: ['Oca','Şub','Mar','Nis','May','Haz','Tem','Ağu','Eyl','Eki','Kas','Ara'],
  dayNames: ['Pazar','Pazartesi','Salı','Çarşamba','Perşembe','Cuma','Cumartesi'],
  dayNamesShort: ['Paz','Pzt','Sal','Çar','Per','Cum','Cmt'],
  today: 'Bugün'
};
LocaleConfig.defaultLocale = 'tr';

const monthsTR = ['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'];
function formatDateShort(dateString: string) {
  if (!dateString.includes('-')) return dateString;
  const [year, month, day] = dateString.split('-');
  if (!year || !month || !day) return dateString;
  return `${parseInt(day)} ${monthsTR[parseInt(month) - 1]}`;
}

// 🗂️ Tip tanımları
type NoteItem = {
  id: string;
  date: string;
  text: string;
};

type AppointmentItem = {
  id: string;
  date: string;
  time: string;
  customerName: string;
};

type CombinedItem =
  | (AppointmentItem & { type: 'appointment' })
  | (NoteItem & { type: 'note' });

function generateMarkedDates(notes: NoteItem[], appointments: AppointmentItem[]) {
  const marked: Record<string, any> = {};
  notes.forEach(note => {
    marked[note.date] = { marked: true, dotColor: 'tomato' };
  });
  appointments.forEach(app => {
    marked[app.date] = { marked: true, dotColor: 'blue' };
  });
  return marked;
}

// 🔼 Üst bileşen
const HeaderComponent = memo(function HeaderComponent({
  selectedDate,
  setSelectedDate,
  newNote,
  setNewNote,
  addNote,
  userName,
  userAge,
  notes,
  appointments
}: any) {
  return (
    <View style={styles.topContainer}>
      <StatusBar backgroundColor="rgb(194,185,125)" barStyle="dark-content" />
      <View style={styles.welcomeBox}>
        <Text style={styles.welcomeText}>
          Hoş geldin, {userName ? `${userName} (Yaş: ${userAge ?? '---'})` : '[Kullanıcı bilgisi yükleniyor...]'}
        </Text>
      </View>
      <Text style={styles.title}>Takvim</Text>
      <Calendar
        style={{ height: 280 }}
        hideExtraDays
        onDayPress={(day: DateData) => setSelectedDate(day.dateString)}
        markedDates={{
          ...generateMarkedDates(notes, appointments),
          [selectedDate]: {
            selected: true,
            selectedColor: 'rgb(194,185,125)',
          },
        }}
        theme={{
          calendarBackground: '#FFF',
          selectedDayBackgroundColor: 'rgb(194,185,125)',
          todayTextColor: '#FF69B4',
          monthTextColor: 'rgb(194,185,125)',
        }}
      />
      {selectedDate && (
        <Text style={styles.selectedDateText}>Seçilen Tarih: {formatDateShort(selectedDate)}</Text>
      )}
      {selectedDate && (
        <View style={styles.inputContainer}>
          <CustomTextInput
            label="Not:"
            value={newNote}
            onChangeText={setNewNote}
            keyboardType="default"
          />
          <TouchableOpacity style={styles.button} onPress={addNote}>
            <Text style={styles.buttonText}>Kaydet</Text>
          </TouchableOpacity>
        </View>
      )}
      {selectedDate && <Text style={styles.notesTitle}>İçerikler:</Text>}
    </View>
  );
});

// 🧠 Ana bileşen
export default function DietitianPanel() {
  const [selectedDate, setSelectedDate] = useState('');
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [appointments, setAppointments] = useState<AppointmentItem[]>([]);
  const [newNote, setNewNote] = useState('');
  const [userName, setUserName] = useState<string | null>(null);
  const [userAge, setUserAge] = useState<number | null>(null);

  useEffect(() => {
    const db = getFirestore();
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const uid = currentUser.uid;

        const userDocRef = doc(db, 'users', uid);
        const snapshot = await getDoc(userDocRef);
        if (snapshot.exists()) {
          const data = snapshot.data();
          setUserName(`${data.firstName} ${data.lastName}`.trim());
          setUserAge(calculateAge(data.birthDate ?? ''));
        }

        // Notları al
        const noteRef = doc(db, 'notes', uid);
        const notesSnap = await getDoc(noteRef);
        const loadedNotes: NoteItem[] = [];
        if (notesSnap.exists()) {
          const data = notesSnap.data();
          Object.entries(data).forEach(([date, noteList]) => {
            if (Array.isArray(noteList)) {
              noteList.forEach((text: string) => {
                loadedNotes.push({ id: `${date}-${text.slice(0, 10)}-${Math.random()}`, date, text });
              });
            }
          });
        }
        setNotes(loadedNotes);

        // Randevuları al
        const appRef = doc(db, 'appointments', 'diyetisyen_uid');
        const appSnap = await getDoc(appRef);
        const loadedApps: AppointmentItem[] = [];
        if (appSnap.exists()) {
          const data = appSnap.data();
          (data.appointments || []).forEach((item: any, index: number) => {
            loadedApps.push({
              id: `${item.date}-${index}`,
              date: item.date,
              time: item.time,
              customerName: item.danisanAdSoyad || 'Danışan'
            });
          });
        }
        setAppointments(loadedApps);
      }
    });
    return () => unsubscribe();
  }, []);

  // ➕ Not ekleme
  const addNote = async () => {
    if (!selectedDate || newNote.trim() === '') return;
    const db = getFirestore();
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    const noteRef = doc(db, 'notes', userId);
    await setDoc(noteRef, {
      [selectedDate]: arrayUnion(newNote.trim())
    }, { merge: true });

    const note: NoteItem = {
      id: Date.now().toString(),
      date: selectedDate,
      text: newNote,
    };
    setNotes([...notes, note]);
    setNewNote('');
  };

  // ❌ Not silme
  const deleteNote = async (id: string) => {
    const noteToDelete = notes.find(n => n.id === id);
    if (!noteToDelete) return;
    setNotes(notes.filter(n => n.id !== id));

    const db = getFirestore();
    const userId = auth.currentUser?.uid;
    if (!userId) return;
    const noteRef = doc(db, 'notes', userId);
    await updateDoc(noteRef, {
      [noteToDelete.date]: arrayRemove(noteToDelete.text)
    });
  };

  // 📊 Veri filtreleme
  const combinedData: CombinedItem[] = [
    ...appointments.map(item => ({ ...item, type: 'appointment' as const })),
    ...notes.map(item => ({ ...item, type: 'note' as const }))
  ].filter(item => item.date === selectedDate);

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <FlatList
          data={combinedData}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.noteCard}>
              <View style={styles.noteDateContainer}>
                <Text style={styles.noteDateText}>{formatDateShort(item.date)}</Text>
              </View>
              {item.type === 'appointment' ? (
                <Text style={styles.noteText}>📅 {item.customerName} - {item.time}</Text>
              ) : (
                <Text style={styles.noteText}>📝 {item.text}</Text>
              )}
              {item.type === 'note' && (
                <TouchableOpacity onPress={() => deleteNote(item.id)} style={styles.trashIcon}>
                  <Ionicons name="trash" size={20} color="#FF0000" />
                </TouchableOpacity>
              )}
            </View>
          )}
          ListHeaderComponent={
            <HeaderComponent
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              newNote={newNote}
              setNewNote={setNewNote}
              addNote={addNote}
              userName={userName}
              userAge={userAge}
              notes={notes}
              appointments={appointments}
            />
          }
          ListEmptyComponent={
            selectedDate !== '' ? (
              <Text style={styles.emptyText}>Bu tarihe ait içerik yok.</Text>
            ) : null
          }
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F8F8' },
  topContainer: { paddingHorizontal: 16, backgroundColor: '#F8F8F8' },
  welcomeBox: { backgroundColor: 'rgb(194,185,125)', padding: 12, borderRadius: 8, marginTop: 8, marginBottom: 8 },
  welcomeText: { fontSize: 18, color: '#fff', fontWeight: 'bold', textAlign: 'center' },
  title: { fontSize: 20, fontWeight: '600', marginTop: 16, marginBottom: 8, textAlign: 'center' },
  selectedDateText: { fontSize: 16, textAlign: 'center', marginVertical: 10, color: '#333' },
  inputContainer: { marginTop: 20 },
  button: { marginTop: 10, backgroundColor: 'rgb(194,185,125)', paddingVertical: 12, alignItems: 'center', borderRadius: 8 },
  buttonText: { fontSize: 16, color: '#000' },
  notesTitle: { fontSize: 18, fontWeight: '600', marginTop: 20, textAlign: 'center' },
  emptyText: { fontStyle: 'italic', color: '#666', textAlign: 'center', marginTop: 16 },
  noteCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF7E0', padding: 12, borderRadius: 8, marginVertical: 4, marginHorizontal: 16 },
  noteDateContainer: { backgroundColor: 'rgb(194,185,125)', borderRadius: 8, paddingVertical: 4, paddingHorizontal: 8, marginRight: 10 },
  noteDateText: { color: '#FFF', fontWeight: 'bold' },
  noteText: { flex: 1, fontSize: 16, color: '#333' },
  trashIcon: { marginLeft: 10 },
});
