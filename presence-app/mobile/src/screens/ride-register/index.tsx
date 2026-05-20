import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { StackParamList } from '../../routes/stack';
import { SCREEN_NAMES } from '../../constants/screens';
import { useAuth } from '../../context';
import { createRide } from '../../services/rideService';

type Props = StackScreenProps<StackParamList, typeof SCREEN_NAMES.RIDE_REGISTER>;

function toDateString(d: Date): string {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function displayToIso(display: string): string | null {
  // Accepts DD/MM/YYYY → YYYY-MM-DD
  const parts = display.replace(/\D/g, '');
  if (parts.length !== 8) return null;
  const dd = parts.slice(0, 2);
  const mm = parts.slice(2, 4);
  const yyyy = parts.slice(4, 8);
  const d = new Date(`${yyyy}-${mm}-${dd}`);
  if (isNaN(d.getTime())) return null;
  return `${yyyy}-${mm}-${dd}`;
}

function formatDateInput(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

function isoToDisplay(iso: string): string {
  const [yyyy, mm, dd] = iso.split('-');
  return `${dd}/${mm}/${yyyy}`;
}

export default function RideRegisterScreen({ navigation }: Props) {
  const { user } = useAuth();
  const todayDisplay = isoToDisplay(toDateString(new Date()));

  const [date, setDate] = useState(todayDisplay);
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSave() {
    const isoDate = displayToIso(date);
    if (!isoDate) {
      Alert.alert('Data inválida', 'Informe a data no formato DD/MM/AAAA.');
      return;
    }
    if (!description.trim()) {
      Alert.alert('Atenção', 'Informe a descrição da carona.');
      return;
    }

    const parsedPrice = price.trim() ? parseFloat(price.replace(',', '.')) : null;
    if (price.trim() && (isNaN(parsedPrice!) || parsedPrice! < 0)) {
      Alert.alert('Valor inválido', 'Informe um valor numérico válido ou deixe em branco.');
      return;
    }

    setLoading(true);
    try {
      await createRide({
        creatorId: user!.uid,
        creatorName: user!.displayName ?? user!.email ?? 'Aluno',
        date: isoDate,
        description: description.trim(),
        price: parsedPrice,
      });
      Alert.alert('Carona cadastrada!', 'A carona foi registrada com sucesso.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch {
      Alert.alert('Erro', 'Não foi possível cadastrar a carona. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Cadastrar Carona</Text>
        <View style={styles.headerSpacer} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.form} keyboardShouldPersistTaps="handled">

          <View style={styles.field}>
            <Text style={styles.label}>Responsável</Text>
            <View style={styles.readOnly}>
              <Text style={styles.readOnlyText}>
                {user?.displayName ?? user?.email ?? 'Aluno'}
              </Text>
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Data <Text style={styles.required}>*</Text></Text>
            <TextInput
              style={styles.input}
              placeholder="DD/MM/AAAA"
              placeholderTextColor="#9CA3AF"
              value={date}
              onChangeText={(t) => setDate(formatDateInput(t))}
              keyboardType="numeric"
              maxLength={10}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Descrição <Text style={styles.required}>*</Text></Text>
            <TextInput
              style={[styles.input, styles.inputMultiline]}
              placeholder="Ex: Carona saindo da rodoviária às 18h..."
              placeholderTextColor="#9CA3AF"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Valor (opcional)</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: 15.00"
              placeholderTextColor="#9CA3AF"
              value={price}
              onChangeText={setPrice}
              keyboardType="decimal-pad"
            />
          </View>

          <TouchableOpacity
            style={[styles.saveBtn, loading && styles.saveBtnDisabled]}
            onPress={handleSave}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.saveBtnText}>Cadastrar Carona</Text>
            )}
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  backBtn: { padding: 4 },
  backText: { fontSize: 15, color: '#6366F1', fontWeight: '600' },
  title: { fontSize: 18, fontWeight: '700', color: '#1E1E2E' },
  headerSpacer: { width: 60 },
  form: { padding: 20, gap: 20 },
  field: { gap: 6 },
  label: { fontSize: 14, fontWeight: '600', color: '#374151' },
  required: { color: '#EF4444' },
  input: {
    backgroundColor: '#FFF',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#1E1E2E',
  },
  inputMultiline: { minHeight: 90 },
  readOnly: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  readOnlyText: { fontSize: 15, color: '#6B7280' },
  saveBtn: {
    backgroundColor: '#6366F1',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 8,
  },
  saveBtnDisabled: { backgroundColor: '#A5B4FC' },
  saveBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});
